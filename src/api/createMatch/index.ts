import { supabase } from "@/database/supabase";
import { useMutation, useQuery } from "@tanstack/react-query";

import { useQueryClient } from "@tanstack/react-query";

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
      // Invalida o cache para "clubs" e força o refetch
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
