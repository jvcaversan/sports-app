import { useClubMembers } from "@/api/club_members";
import { useClubsById } from "@/api/clubs";
import { useLocalSearchParams } from "expo-router";
import { ActivityIndicator, FlatList, SafeAreaView, Text } from "react-native";

export default function ClubDetails() {
  const { id } = useLocalSearchParams();

  const clubId = Array.isArray(id) ? id[0] : id;

  const { data: club, isLoading, isError } = useClubsById(clubId);

  const { data: members } = useClubMembers(clubId);

  // Caso o dado esteja carregando ou tenha dado erro, exibe isso na tela
  if (isLoading) {
    return (
      <SafeAreaView>
        <ActivityIndicator size="large" />
        <Text>Carregando...</Text>
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView>
        <Text>Erro ao carregar o clube.</Text>
      </SafeAreaView>
    );
  }

  // Caso o clube não tenha sido encontrado
  if (!club) {
    return (
      <SafeAreaView>
        <Text>Clube não encontrado.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView>
      <Text>Club id: {id}</Text>
      <Text>CLUB NAME:{club.name}</Text>
      {members && members.length > 0 ? (
        <FlatList
          data={members}
          keyExtractor={(item) => item.player_id}
          renderItem={({ item }) => (
            <Text>{`Jogador: ${item.name} - Função: ${item.role}`}</Text>
          )}
        />
      ) : (
        <Text>Clube sem Membros até o momento</Text>
      )}
    </SafeAreaView>
  );
}
