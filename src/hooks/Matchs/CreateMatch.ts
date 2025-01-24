import { useState } from "react";
import { useCreateMatch } from "@/api/createMatch";
import { router, useLocalSearchParams } from "expo-router";
import { useSessionStore } from "@/store/useSessionStore";

export const useCreateMatchHandler = () => {
  const [team1Name, setTeam1Name] = useState("");
  const [team2Name, setTeam2Name] = useState("");
  const [local, setLocal] = useState("");
  const [horario, setHorario] = useState("");
  const [dia, setDia] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { mutate: createMatch, error } = useCreateMatch();
  const { session } = useSessionStore();

  const { clubId } = useLocalSearchParams();

  const onCreate = async () => {
    setIsSubmitting(true);

    if (!session) {
      console.error("Usuário não autenticado:");
      setIsSubmitting(false);
      return;
    }

    const userId = session.user.id;

    createMatch(
      {
        time1: team1Name,
        time2: team2Name,
        local,
        horario,
        data: dia,
        userId,
        clubId,
      },
      {
        onSuccess: async (newMatch) => {
          router.replace(`/(user)/clubs/${clubId}/(partidas)/${newMatch.id}`);
        },
        onError: (err) => {
          console.error("Erro ao criar partida:", err.message);
        },
      }
    );

    setIsSubmitting(false);
  };

  return {
    team1Name,
    setTeam1Name,
    isSubmitting,
    team2Name,
    setTeam2Name,
    local,
    setLocal,
    horario,
    setHorario,
    dia,
    setDia,
    onCreate,
  };
};
