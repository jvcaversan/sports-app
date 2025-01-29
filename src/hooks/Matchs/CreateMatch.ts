import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateMatch } from "@/api/createMatch";
import { router, useLocalSearchParams } from "expo-router";
import { useSessionStore } from "@/store/useSessionStore";
import {
  createMatchSchema,
  CreateMatchFormData,
} from "@/schemas/createMatchSchema";

export const useCreateMatchHandler = () => {
  const { mutate: createMatch, error } = useCreateMatch();
  const { session } = useSessionStore();
  const { clubId } = useLocalSearchParams();

  const form = useForm<CreateMatchFormData>({
    resolver: zodResolver(createMatchSchema),
    defaultValues: {
      team1Name: "",
      team2Name: "",
      local: "",
      horario: "",
      dia: "",
    },
  });

  const onSubmit = (data: CreateMatchFormData) => {
    if (!session) {
      console.error("Usuário não autenticado:");
      return;
    }

    createMatch(
      {
        time1: data.team1Name,
        time2: data.team2Name,
        local: data.local,
        horario: data.horario,
        data: data.dia,
        userId: session.user.id,
        clubId,
      },
      {
        onSuccess: (newMatch) => {
          router.replace(`/(user)/clubs/${clubId}/(partidas)/${newMatch.id}`);
        },
        onError: (err) => {
          console.error("Erro ao criar partida:", err.message);
        },
      }
    );
  };

  return {
    form,
    onSubmit,
    isSubmitting: form.formState.isSubmitting,
    error,
  };
};
