import { useClubDetails } from "@/hooks/Clubs/ClubDetails";
import { useLocalSearchParams } from "expo-router";
import { View, StyleSheet } from "react-native";
import { ClubHeader } from "@/components/ClubsTabs/ClubHeader";
import { Tables } from "@/types/supabase";
import { LoadingState } from "@/components/Erros/LoadingState";
import { ErrorState } from "@/components/Erros/ErroState";
import CustomScreen from "@/components/CustomView";
import { ClubTabs } from "@/components/ClubsTabs/Tabs";

export default function ClubDetails() {
  const { id } = useLocalSearchParams();
  const clubId = Array.isArray(id) ? id[0] : id;

  const { club, members, matchs, isLoading, isError } = useClubDetails(clubId);

  const handleSelectUser = (user: Tables<"club_members">) => {
    console.log(
      `Clicado no usuário com id = ${user.player_id}, nome: ${user.name}`
    );
  };

  if (isLoading) {
    return <LoadingState message="Carregando clube..." />;
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
        <ClubHeader clubName={club.name} clubId={clubId} />

        <View style={styles.mainContent}>
          <ClubTabs
            members={members || []}
            matchs={matchs || []}
            isMembersLoading={isLoading}
            handleSelectUser={handleSelectUser}
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
