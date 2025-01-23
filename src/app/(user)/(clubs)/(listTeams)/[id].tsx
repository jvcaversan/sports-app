import { useClubDetails } from "@/hooks/Clubs/ClubDetails";
import { useLocalSearchParams } from "expo-router";
import { View, StyleSheet } from "react-native";
import { ClubHeader } from "@/components/ClubsTabs/ClubHeader";
import { Tables } from "@/types/supabase";
import { LoadingState } from "@/components/Erros/LoadingState";
import { ErrorState } from "@/components/Erros/ErroState";
import CustomScreen from "@/components/CustomView";
import { ClubTabs } from "@/components/ClubsTabs/Tabs";
import { useIsClubAdmin } from "@/api/club_members";
import { useSessionStore } from "@/store/useSessionStore";

export default function ClubDetails() {
  const { id } = useLocalSearchParams();
  const clubId = Array.isArray(id) ? id[0] : id;

  const { session } = useSessionStore();
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
  } = useIsClubAdmin(clubId, userId || "");

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

  return (
    <CustomScreen>
      <View style={styles.container}>
        <ClubHeader clubName={club.name} clubId={clubId} isAdmin={!!isAdmin} />

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
