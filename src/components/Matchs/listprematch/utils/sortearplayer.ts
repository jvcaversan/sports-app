import { supabase } from "@/database/supabase";

import { useQuery } from "@tanstack/react-query";

export const useConfirmedMensalistaPlayers = (matchId: string) => {
  return useQuery({
    queryKey: ["confirmedMensalistaPlayers", matchId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select(
          `
          id,
          name,
          club_members(mensalista),
          player_ratings(position, rating),
          match_invitations(status, match_id)
        `
        )
        .eq("match_invitations.status", "accepted")
        .eq("match_invitations.match_id", matchId);

      if (error) throw error;
      return data;
    },
  });
};
