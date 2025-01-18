import { useState } from "react";
import { useCreateClub } from "@/api/clubs";
import { useSessionStore } from "@/store/useSessionStore";
import { useProfile } from "@/api/profiles";
import { router } from "expo-router";

export const useCreateClubHandler = () => {
  const [clubName, setClubName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { mutate: createClub } = useCreateClub();
  const { session } = useSessionStore();
  const userId = session?.user.id;
  const { data: profile } = useProfile(userId);

  const onCreate = async () => {
    setIsSubmitting(true);

    if (!session) {
      console.error("Usuário não autenticado.");
      setIsSubmitting(false);
      return;
    }

    if (!userId) {
      console.error("Usuário não encontrado.");
      setIsSubmitting(false);
      return;
    }

    createClub(
      { name: clubName, created_by: userId, creator_name: profile?.name },
      {
        onSuccess: async (newClub) => {
          router.replace(`/(user)/(clubs)/(listTeams)/${newClub.id}`);
        },
        onError: (err) => {
          console.error("Erro ao criar clube:", err.message);
        },
      }
    );

    setIsSubmitting(false);
  };

  return {
    clubName,
    setClubName,
    isSubmitting,
    onCreate,
  };
};
