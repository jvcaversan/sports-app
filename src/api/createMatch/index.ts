import { supabase } from "@/database/supabase";
import { useMutation } from "@tanstack/react-query";

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
