import { useClubMembers } from "@/api/club_members";
import { useClubsById } from "@/api/clubs";
import { useLocalSearchParams } from "expo-router";
import { ActivityIndicator, SafeAreaView, Text } from "react-native";

export default function ClubDetails() {
  const { id } = useLocalSearchParams();

  const clubId = Array.isArray(id) ? id[0] : id;

  const { data: club, isLoading, isError } = useClubsById(clubId);

  const { data: member } = useClubMembers(clubId);

  console.log(member);

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
      <Text>PlayerName:{member[0].profiles.name}</Text>
      <Text>PlayerName:{member[0].role}</Text>
    </SafeAreaView>
  );
}
