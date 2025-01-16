import { supabase } from "@/database/supabase";
import { Club } from "@/types/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface ClubsMember {
  club_id: string;
  clubs: { name: string };
  joined_at: string;
}

interface Clubs {
  id: string;
  name: string;
}

export const useCreateClub = () => {
  const queryClient = useQueryClient();

  return useMutation({
    async mutationFn(data: Omit<Club, "id" | "created_at">) {
      const { error, data: newClub } = await supabase
        .from("clubs")
        .insert({
          name: data.name,
          photo: data.photo || null,
          created_by: data.created_by,
          creator_name: data.creator_name,
        })
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }
      return newClub;
    },
    onSuccess: () => {
      // Invalida o cache para "clubs" e força o refetch
      queryClient.invalidateQueries({ queryKey: ["clubs"] });
    },
  });
};

export const useListClubs = () => {
  return useQuery({
    queryKey: ["clubs"],
    queryFn: async () => {
      const { data, error } = await supabase.from("clubs").select("*");
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
  });
};

export const useClubsById = (id: string) => {
  return useQuery({
    queryKey: ["clubs", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("clubs")
        .select("*")
        .eq("id", id)
        .single();
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
  });
};

export const useClubsByUserId = (userId?: string) => {
  return useQuery({
    queryKey: ["clubs", userId],
    queryFn: async (): Promise<Clubs[]> => {
      if (!userId) {
        throw new Error("User ID is required");
      }

      const { data, error } = await supabase
        .from("club_members")
        .select("club_id, clubs(name), joined_at")
        .eq("player_id", userId)
        .order("joined_at", { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      return data.map((item) => {
        const clubMember = item as unknown as ClubsMember;
        return {
          id: clubMember.club_id,
          name: clubMember.clubs?.name || "Nome não disponível",
          joined_at: clubMember.joined_at,
        };
      });
    },
    enabled: !!userId,
  });
};
