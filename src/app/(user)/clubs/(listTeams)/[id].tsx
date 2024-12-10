import { useSearchUser } from "@/api/club_invitation";
import { useClubMembers } from "@/api/club_members";
import { useClubsById } from "@/api/clubs";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
} from "react-native";

export default function ClubDetails() {
  const [query, setQuery] = useState(""); // Query de busca

  const { id } = useLocalSearchParams();
  const clubId = Array.isArray(id) ? id[0] : id;

  const { data: club, isLoading, isError } = useClubsById(clubId);
  const { data: members } = useClubMembers(clubId);

  const {
    data: users,
    isLoading: isSearching,
    isError: errorSearch,
  } = useSearchUser(query);

  const handleChange = (text: string) => {
    setQuery(text.trim());
  };

  const handleSelectUser = (user: { id: string; name: string }) => {
    Alert.alert(`Selecionado: ${user.name} (ID: ${user.id})`);
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={styles.loadingText}>Carregando...</Text>
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Erro ao carregar o clube.</Text>
      </SafeAreaView>
    );
  }

  if (!club) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Clube não encontrado.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.clubName}>{club.name}</Text>
        <TouchableOpacity
          style={styles.createMatchButton}
          onPress={() => {
            router.navigate(
              `/(user)/clubs/(listTeams)/createMatch?clubId=${clubId}`
            );
          }}
        >
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchSection}>
        <TextInput
          value={query}
          onChangeText={handleChange}
          placeholder="Buscar por usuário"
          style={styles.searchInput}
        />
        {query !== "" && !isSearching && users && (
          <View style={styles.dropdown}>
            <FlatList
              data={users}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.dropdownItem}
                  onPress={() => handleSelectUser(item)}
                >
                  <Text style={styles.dropdownText}>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        )}
        {query.trim() !== "" && !isSearching && users?.length === 0 && (
          <Text style={styles.noResultsText}>
            Nenhum usuário encontrado para "{query}"
          </Text>
        )}
      </View>

      <View>
        <Text>Clube ID: {clubId}</Text>
      </View>

      <Text style={styles.sectionTitle}>Membros do Clube</Text>
      {members && members.length > 0 ? (
        <FlatList
          data={members}
          keyExtractor={(item) => item.player_id}
          renderItem={({ item }) => (
            <Text style={styles.memberText}>
              {item.name} - {item.role}
            </Text>
          )}
          style={styles.memberList}
        />
      ) : (
        <Text style={styles.noMembersText}>
          Este clube ainda não possui membros.
        </Text>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
    padding: 10,
    backgroundColor: "#3498db", // Cor de fundo do cabeçalho
    borderRadius: 10, // Bordas arredondadas
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  clubName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff", // Cor do texto do nome do clube
  },
  searchSection: {
    marginBottom: 20,
    position: "relative",
  },
  searchInput: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#333",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  dropdown: {
    position: "absolute",
    top: 60,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    zIndex: 10,
    maxHeight: 200,
  },
  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  dropdownText: {
    fontSize: 16,
    color: "#333",
  },
  noResultsText: {
    marginTop: 10,
    fontSize: 14,
    color: "#888",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#34495e",
    marginBottom: 10,
  },
  memberList: {
    marginBottom: 20,
  },
  memberText: {
    fontSize: 16,
    paddingVertical: 8,
    color: "#2c3e50",
  },
  noMembersText: {
    fontSize: 14,
    color: "#888",
    fontStyle: "italic",
  },
  loadingText: {
    fontSize: 16,
    color: "#3498db",
    textAlign: "center",
    marginTop: 10,
  },
  errorText: {
    fontSize: 16,
    color: "#e74c3c",
    textAlign: "center",
  },
  createMatchButton: {
    backgroundColor: "#2ecc71", // Cor de fundo do botão
    borderRadius: 50, // Botão redondo
    padding: 12, // Espaçamento interno
    elevation: 4, // Sombra
  },
});
