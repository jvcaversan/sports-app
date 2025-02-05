import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["match-lineups", variables.match_id],
        exact: true,
      });
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
      match_id,
    }: {
      lineup_id: string;
      team_name: string;
      players: Array<{ id: string; position: string }>;
      match_id: string;
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
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["match-lineups", variables.match_id],
        exact: true,
      });
    },
  });
};

export const useConfirmedPlayers = (matchId: string) => {
  return useQuery({
    queryKey: ["confirmedMensalistaPlayers", matchId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select(
          `
          id,
          name,
          club_members(membership),
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

export const useMatchDetails = (matchId: string) => {
  return useQuery({
    queryKey: ["matchDetails", matchId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("matches")
        .select(
          `
          team1,
          team2
        `
        )
        .eq("id", matchId)
        .single();

      if (error) throw error;
      return data;
    },
  });
};
