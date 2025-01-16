import { supabase } from "@/database/supabase";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Database } from "@/types/supabase";

type ClubInvitationInsert =
  Database["public"]["Tables"]["club_invitations"]["Insert"];
type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export const useSendInvitation = () => {
  return useMutation({
    async mutationFn({
      clubId,
      userId,
      invitedBy,
    }: {
      clubId: string;
      userId: string;
      invitedBy: string;
    }) {
      const { error, data } = await supabase
        .from("club_invitations")
        .insert([
          {
            club_id: clubId,
            user_id: userId,
            invited_by: invitedBy,
            status: "pending",
          } as ClubInvitationInsert,
        ])
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
  });
};

export const useSearchUser = (query: string) => {
  return useQuery({
    queryKey: ["profiles", "search", query],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, name")
        .ilike("name", `%${query}%`);

      if (error) {
        throw new Error(`Erro ao buscar usuários: ${error.message}`);
      }

      return data as Profile[];
    },
    enabled: !!query && query.trim() !== "",
  });
};
