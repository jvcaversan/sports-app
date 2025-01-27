import { supabase } from "@/database/supabase";
import { Tables } from "@/types/supabase";
import { useMutation, useQuery } from "@tanstack/react-query";

import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

export const useCreateMatch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    async mutationFn(data: any) {
      if (!data.userId) {
        throw new Error("ID do usuário é obrigatório para criar o clube.");
      }

      const { error, data: newMatch } = await supabase
        .from("matches")
        .insert({
          team1: data.time1,
          team2: data.time2,
          local: data.local,
          horario: data.horario,
          data: data.data,
          clubid: data.clubId,
          createdby: data.userId,
        })
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }
      return newMatch;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["matches"] });
    },
  });
};

export const useMatchsByClubId = (clubId: string) => {
  return useQuery({
    queryKey: ["matches", clubId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("matches")
        .select("*")
        .eq("clubid", clubId);
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
  });
};

export const useStaticsByMatchId = (matchId: string) => {
  return useQuery({
    queryKey: ["matches", matchId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("matches")
        .select("id, team1, team2, local, horario, data, createdby")
        .eq("id", matchId);
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
  });
};

export const useMatchInvitations = (matchId: string) => {
  const queryClient = useQueryClient();

  const { data, ...rest } = useQuery({
    queryKey: ["matchInvitations", matchId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("match_invitations")
        .select("*, profiles(*)")
        .eq("match_id", matchId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!matchId,
  });

  useEffect(() => {
    if (!matchId) return;

    const channel = supabase
      .channel("match-invites-real-time")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "match_invitations",
          filter: `match_id=eq.${matchId}`,
        },
        () => {
          queryClient.invalidateQueries({
            queryKey: ["matchInvitations", matchId],
          });
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [matchId, queryClient]);

  return {
    data: data || [],
    ...rest,
  };
};

export const useSendSuplentesInvites = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      matchId,
      clubId,
    }: {
      matchId: string;
      clubId: string;
    }) => {
      const { data: suplentes, error } = await supabase
        .from("club_members")
        .select("player_id")
        .eq("club_id", clubId)
        .eq("mensalistas", false);

      if (error) throw error;
      if (!suplentes?.length) throw new Error("Nenhum suplente encontrado");

      const { data: existing } = await supabase
        .from("match_invitations")
        .select("player_id")
        .eq("match_id", matchId);

      const existingIds = existing?.map((i) => i.player_id) || [];
      const filtered = suplentes.filter(
        (s) => !existingIds.includes(s.player_id)
      );

      const { data: invitations, error: insertError } = await supabase
        .from("match_invitations")
        .insert(
          filtered.map((s) => ({
            match_id: matchId,
            player_id: s.player_id,
            status: "pending",
          }))
        )
        .select();

      if (insertError) throw insertError;
      return invitations;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["matchInvitations"] });
    },
  });
};
