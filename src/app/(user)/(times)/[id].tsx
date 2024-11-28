import { useSearchUser } from "@/api/club_invitation";
import { useClubMembers } from "@/api/club_members";
import { useClubsById } from "@/api/clubs";
import { supabase } from "@/database/supabase";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Button,
  FlatList,
  SafeAreaView,
  Text,
  TextInput,
  View,
} from "react-native";

export default function ClubDetails() {
  const [search, setSearch] = useState(""); // Termo para busca
  const [query, setQuery] = useState(""); // Input do usuário

  const { id } = useLocalSearchParams();
  const clubId = Array.isArray(id) ? id[0] : id;

  const { data: club, isLoading, isError } = useClubsById(clubId);
  const { data: members } = useClubMembers(clubId);

  const {
    data: users,
    isLoading: isSearching,
    isError: errorSearch,
  } = useSearchUser(search);

  const handleSearch = () => {
    if (query.trim() === "") {
      console.log("Por favor, insira um termo para buscar.");
      return;
    }
    setSearch(query.trim()); // Remove espaços extras e atualiza o termo de busca
  };

  useEffect(() => {
    // Aguarda o término da busca antes de processar os resultados
    if (!isSearching) {
      if (users && users.length > 0) {
        console.log("Usuários encontrados:", users);
      } else if (search) {
        console.log("Nenhum usuário encontrado para o termo:", search);
      }
    }
  }, [users, search, isSearching]);

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
      <Text>CLUB NAME: {club.name}</Text>

      <Text>Membros do Clube</Text>
      {members && members.length > 0 ? (
        <FlatList
          data={members}
          keyExtractor={(item) => item.player_id}
          renderItem={({ item }) => (
            <Text>{`Jogador: ${item.name} - Função: ${item.role}`}</Text>
          )}
        />
      ) : (
        <Text>Clube sem membros até o momento</Text>
      )}

      <Text>Buscar Usuário</Text>
      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder="Digite o nome ou ID do usuário"
        style={{ borderWidth: 1, padding: 8, marginVertical: 10 }}
      />

      <Button title="Buscar" onPress={handleSearch} />

      {isSearching && <Text>Carregando...</Text>}
      {errorSearch && <Text>Erro ao buscar usuários</Text>}

      {users && users.length > 0 ? (
        <FlatList
          data={users}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={{ padding: 8, borderBottomWidth: 1 }}>
              <Text>{`ID: ${item.id}`}</Text>
              <Text>{`Nome: ${item.name}`}</Text>
            </View>
          )}
        />
      ) : (
        search &&
        !isSearching && (
          <Text>Nenhum usuário encontrado para o termo "{search}"</Text>
        )
      )}
    </SafeAreaView>
  );
}
