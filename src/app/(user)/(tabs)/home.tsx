import React from "react";
import { View, Text, TouchableOpacity, Pressable } from "react-native";
import { StyleSheet } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import CustomScreen from "@/components/CustomView";
import { useProfile } from "@/api/profiles";
import { useSessionStore } from "@/store/useSessionStore";

export default function Home() {
  const { session } = useSessionStore();

  if (!session) {
    throw new Error("No Session");
  }
  const userId = session.user.id;

  const { data: profile } = useProfile(userId);

  return (
    <CustomScreen>
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{profile?.name}</Text>

          <TouchableOpacity onPress={() => router.navigate("/profile")}>
            <Ionicons name="settings-outline" size={24} color="#333" />
          </TouchableOpacity>
        </View>
      </View>
      <Pressable
        style={styles.statsContainer}
        onPress={() => router.navigate("/statics")}
      >
        <Text style={styles.sectionTitle}>Estatísticas</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            {/* <Text style={styles.statNumber}>{user.gamesPlayed}</Text> */}
            <Text style={styles.statLabel}>Jogos</Text>
          </View>
          <View style={styles.statItem}>
            {/* <Text style={styles.statNumber}>{user.wins}</Text> */}
            <Text style={styles.statLabel}>Vitórias</Text>
          </View>
          <View style={styles.statItem}>
            {/* <Text style={styles.statNumber}>{user.losses}</Text> */}
            <Text style={styles.statLabel}>Derrotas</Text>
          </View>
        </View>
      </Pressable>

      <Pressable onPress={() => router.navigate("/(user)/accepted")}>
        <Text>Accepted Page</Text>
      </Pressable>
    </CustomScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    backgroundColor: "#fff",
  },
  userInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
  },
  statsContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#f5f5f5",
    padding: 16,
    borderRadius: 8,
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  statLabel: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  upcomingGames: {
    padding: 16,
  },
  gameCard: {
    backgroundColor: "#f5f5f5",
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  gameDate: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  gameInfo: {
    fontSize: 14,
    color: "#666",
  },
  listContainer: {
    flexGrow: 1,
  },
});
