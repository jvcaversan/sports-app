import React from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { StyleSheet } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import CustomScreen from "@/components/CustomView";
import { useClubsByUserId } from "@/api/clubs";
import { useSessionStore } from "@/store/useSessionStore";
import ClubListItem from "@/components/GroupList";

export default function Groups() {
  const { session } = useSessionStore();

  if (!session || !session.user.id) {
    throw new Error("Usuário não está logado ou sem ID");
  }

  const userId = session.user.id;

  const { data: clubs, error, isLoading } = useClubsByUserId(userId);

  if (isLoading) {
    return (
      <CustomScreen>
        <Text style={styles.message}>Carregando grupos...</Text>
      </CustomScreen>
    );
  }

  if (error) {
    return (
      <CustomScreen>
        <Text style={styles.message}>
          Erro ao carregar grupos: {error?.message || "Erro desconhecido"}
        </Text>
      </CustomScreen>
    );
  }

  return (
    <CustomScreen>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Meus Grupos</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => router.navigate("/(clubs)/createTeam")}
          >
            <Ionicons name="add" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
        {!clubs || clubs.length === 0 ? (
          <CustomScreen>
            <Text style={styles.message}>
              Você ainda não faz parte de nenhum grupo.
            </Text>
          </CustomScreen>
        ) : (
          <FlatList
            data={clubs}
            renderItem={({ item }) => <ClubListItem club={item} />}
            keyExtractor={(item) => item.club_id}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </CustomScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  addButton: {
    backgroundColor: "#2196F3",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },

  listContainer: {
    paddingVertical: 8,
  },
  message: {
    flex: 1,
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#555",
  },
});
