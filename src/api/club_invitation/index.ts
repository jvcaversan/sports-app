import { supabase } from "@/database/supabase";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useSendInvitation = () => {
  return useMutation({
    async mutationFn({ clubId, userId, invitedBy }: any) {
      const { error, data } = await supabase
        .from("club_invitations")
        .insert([
          {
            club_id: clubId, // ID do grupo/clube
            user_id: userId, // ID do usuário convidado
            invited_by: invitedBy, // ID do convidador
            status: "pending", // Status inicial do convite
          },
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
        .select("id, name") // Escolha os campos que deseja buscar
        .ilike("name", `%${query}%`); // Filtro para buscar no nome

      if (error) {
        throw new Error(`Erro ao buscar usuários: ${error.message}`);
      }

      return data;
    },
    enabled: !!query && query.trim() !== "", // Apenas realiza a query se houver valor em `query`
  });
};
