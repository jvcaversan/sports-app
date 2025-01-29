import { useClubDetails } from "@/hooks/Clubs/ClubDetails";
import { router, useLocalSearchParams } from "expo-router";
import { View, StyleSheet, Alert, Button } from "react-native";
import { ClubHeader } from "@/components/ClubsTabs/ClubHeader";
import { Tables } from "@/types/supabase";
import { LoadingState } from "@/components/Erros/LoadingState";
import { ErrorState } from "@/components/Erros/Error";
import CustomScreen from "@/components/CustomView";
import { ClubTabs } from "@/components/ClubsTabs/Tabs";
import { useIsClubAdmin } from "@/api/club_members";
import { useSessionStore } from "@/store/useSessionStore";
import { useDeleteClub } from "@/api/clubs";

export default function ClubDetails() {
  const { clubId: clubIdParam } = useLocalSearchParams<{ clubId: string }>();
  const clubId = Array.isArray(clubIdParam) ? clubIdParam[0] : clubIdParam;

  const { session } = useSessionStore();

  if (!session) {
    throw new Error("no session");
  }
  const userId = session?.user.id;

  const {
    club,
    members,
    matchs,
    isLoading: clubLoading,
    isError: clubError,
  } = useClubDetails(clubId);

  const {
    data: isAdmin,
    isLoading: adminLoading,
    isError: adminError,
  } = useIsClubAdmin(clubId, userId);

  const { mutate: deleteClub } = useDeleteClub();

  const isLoading = clubLoading || adminLoading;
  const isError = clubError || adminError;

  if (isLoading) {
    return <LoadingState message="Carregando clube..." color="green" />;
  }

  if (isError) {
    return <ErrorState message="Erro ao carregar o clube." />;
  }

  if (!club) {
    return <ErrorState message="Clube não encontrado." />;
  }

  const handleDelete = () => {
    Alert.alert(
      "Confirmar Exclusão",
      "Tem certeza que deseja excluir este clube permanentemente?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          onPress: () =>
            deleteClub(clubId, {
              onSuccess: () => {
                router.back();
                Alert.alert("Sucesso", "Clube excluído com sucesso!");
              },
            }),
        },
      ]
    );
  };

  return (
    <CustomScreen>
      <View style={styles.container}>
        <ClubHeader
          clubName={club.club_name}
          clubId={clubId}
          isAdmin={!!isAdmin}
          onDelete={handleDelete}
        />

        <View style={styles.mainContent}>
          <ClubTabs
            members={members || []}
            matchs={matchs || []}
            isMembersLoading={isLoading}
          />
        </View>
      </View>
    </CustomScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainContent: {
    flex: 1,
    padding: 12,
    paddingTop: 8,
  },
});
