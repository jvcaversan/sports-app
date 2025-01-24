import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
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
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#16A34A" />
          <Text style={styles.loadingText}>Carregando seus clubes...</Text>
        </View>
      </CustomScreen>
    );
  }

  if (error) {
    return (
      <CustomScreen>
        <View style={styles.errorContainer}>
          <Ionicons name="warning" size={40} color="#DC2626" />
          <Text style={styles.errorText}>
            Ocorreu um erro ao carregar os clubes
          </Text>
        </View>
      </CustomScreen>
    );
  }

  return (
    <CustomScreen>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Meus Clubes</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => router.navigate("/(user)/(tabs)/clubs/create-team")}
          >
            <Ionicons name="add" size={28} color="#fff" />
          </TouchableOpacity>
        </View>

        {!clubs || clubs.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="people-outline" size={64} color="#CBD5E1" />
            <Text style={styles.emptyText}>Nenhum clube encontrado</Text>
            <Text style={styles.emptySubtext}>
              Crie um novo clube ou peça para ser adicionado
            </Text>
          </View>
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
    backgroundColor: "#F8FAFC",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 18,
    paddingHorizontal: 24,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 3,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#0F172A",
    letterSpacing: 0.2,
    fontFamily: "Inter-SemiBold",
  },
  addButton: {
    backgroundColor: "#16A34A",
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#059669",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
    transform: [{ scale: 1 }],
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#64748B",
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#94A3B8",
    textAlign: "center",
    marginTop: 8,
    lineHeight: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    color: "#475569",
    fontWeight: "500",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
    padding: 24,
  },
  errorText: {
    fontSize: 18,
    color: "#DC2626",
    fontWeight: "500",
    textAlign: "center",
  },
});
