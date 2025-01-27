import { supabase } from "@/database/supabase";
import { Tables } from "@/types/supabase";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";

export const useClubMembers = (clubId: string) => {
  return useQuery({
    queryKey: ["clubMembers", clubId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("club_members")
        .select("*, profiles(*)")
        .eq("club_id", clubId);

      if (error) throw error;
      return data as (Tables<"club_members"> & {
        profiles: Tables<"profiles"> | null;
      })[];
    },
    enabled: !!clubId,
  });
};

export const useClubMembersByQuery = (clubId: string, searchQuery: string) => {
  const [debouncedQuery] = useDebounce(searchQuery, 300);

  return useQuery({
    queryKey: ["club_members", debouncedQuery],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("club_members")
        .select("*")
        .eq("club_id", clubId)
        .ilike("club_name", `%${debouncedQuery}%`);
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
    enabled: debouncedQuery.length > 2,
    refetchOnWindowFocus: false,
    staleTime: 5000,
    retry: false,
  });
};

export const useClubsByUserAdminId = (adminId: string) => {
  return useQuery({
    queryKey: ["clubs", adminId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("club_members")
        .select("*, clubs(club_name)")
        .eq("player_id", adminId)
        .eq("role", "admin");

      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
  });
};

export const useIsClubAdmin = (clubId: string, userId: string) => {
  return useQuery({
    queryKey: ["club_admin", clubId, userId],
    queryFn: async () => {
      if (!clubId || !userId) return false;
      const { data, error } = await supabase
        .from("club_members")
        .select("role")
        .eq("club_id", clubId)
        .eq("player_id", userId)
        .single();

      return data?.role === "admin";
    },
    enabled: !!userId,
  });
};

export const useSendMensalistasInvites = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      matchId,
      clubId,
    }: {
      matchId: string;
      clubId: string;
    }) => {
      const { data: mensalistas, error } = await supabase
        .from("club_members")
        .select("player_id")
        .eq("club_id", clubId)
        .eq("mensalista", true);

      if (error) throw error;
      if (!mensalistas?.length) throw new Error("Nenhum mensalista encontrado");

      const { data: existingInvites, error: invitesError } = await supabase
        .from("match_invitations")
        .select("player_id")
        .eq("match_id", matchId)
        .eq("status", "pending");

      if (invitesError) throw invitesError;

      const existingPlayerIds =
        existingInvites?.map((invite) => invite.player_id) || [];
      const filteredMensalistas = mensalistas.filter(
        (member) => !existingPlayerIds.includes(member.player_id)
      );

      if (filteredMensalistas.length === 0) {
        throw new Error("Todos os mensalistas já possuem convites pendentes");
      }

      const { data: invitations, error: insertError } = await supabase
        .from("match_invitations")
        .insert(
          filteredMensalistas.map((member) => ({
            match_id: matchId,
            player_id: member.player_id,
            status: "pending",
          }))
        )
        .select();

      if (insertError) throw insertError;
      return invitations;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["matchInvitations", variables.matchId],
      });
    },
  });
};
