import { useClubMembersByQuery } from "@/api/club_members";
import { ClubTabs } from "@/components/ClubsTabs/Tabs";
import { useClubDetails } from "@/hooks/Clubs/ClubDetails";
import { Tables } from "@/types/supabase";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { View, StyleSheet } from "react-native";
import { ClubHeader } from "@/components/ClubsTabs/ClubHeader";
import { SearchInput } from "@/components/ClubsTabs/SearchInput";
import { LoadingState } from "@/components/Erros/LoadingState";
import { ErrorState } from "@/components/Erros/ErroState";
import CustomScreen from "@/components/CustomView";

export default function ClubDetails() {
  const { id } = useLocalSearchParams();
  const clubId = Array.isArray(id) ? id[0] : id;
  const [searchQuery, setSearchQuery] = useState("");

  const { club, members, matchs, isLoading, isError } = useClubDetails(clubId);
  const { data: filteredMembers, isLoading: isMembersLoading } =
    useClubMembersByQuery(clubId, searchQuery);

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

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
            members={filteredMembers || members || []}
            matchs={matchs || []}
            isMembersLoading={isMembersLoading}
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
