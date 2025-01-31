import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/database/supabase";
import { SaveLineupPayload } from "../types";

export const useSaveLineup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ match_id, team_name, players }: SaveLineupPayload) => {
      const { data: lineup, error } = await supabase
        .from("match_lineups")
        .insert({ match_id, team_name })
        .select()
        .single();

      if (error) throw error;

      const { error: playersError } = await supabase
        .from("lineup_players")
        .insert(
          players.map((player) => ({
            lineup_id: lineup.id,
            player_id: player.id,
            position: player.position,
          }))
        );

      if (playersError) throw playersError;
      return lineup;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["match-lineups"] });
    },
  });
};

export const useUpdateLineup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      lineup_id,
      team_name,
      players,
    }: {
      lineup_id: string;
      team_name: string;
      players: Array<{ id: string; position: string }>;
    }) => {
      const { error: updateError } = await supabase
        .from("match_lineups")
        .update({ team_name })
        .eq("id", lineup_id);

      if (updateError) throw updateError;

      const { error: deleteError } = await supabase
        .from("lineup_players")
        .delete()
        .eq("lineup_id", lineup_id);

      if (deleteError) throw deleteError;

      const { error: insertError } = await supabase
        .from("lineup_players")
        .insert(
          players.map((player) => ({
            lineup_id,
            player_id: player.id,
            position: player.position,
          }))
        );

      if (insertError) throw insertError;
      return { lineup_id };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["match-lineups"] });
    },
  });
};
