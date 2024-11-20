import React from "react";
import { View, Text, TouchableOpacity, Pressable } from "react-native";
import { StyleSheet } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import CustomScreen from "@/components/CustomView";

interface Game {
  id: number;
  date: string;
  time: string;
  opponent: string;
}

export default function Home() {
  // Mock data - replace with real data later
  const user = {
    name: "João Silva",
    gamesPlayed: 24,
    wins: 15,
    losses: 9,
  };

  const upcomingGames = [
    { id: 1, date: "2024-03-25", time: "19:00", opponent: "Time A" },
    { id: 2, date: "2024-03-28", time: "20:00", opponent: "Time B" },
  ];

  return (
    <CustomScreen>
      {/* Header com informações do usuário */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{user.name}</Text>

          <TouchableOpacity onPress={() => router.navigate("/(tabs)/perfil")}>
            <Ionicons name="settings-outline" size={24} color="#333" />
          </TouchableOpacity>
        </View>
      </View>
      <Pressable
        style={styles.statsContainer}
        onPress={() => router.navigate("/(tabs)/estatisticas")}
      >
        <Text style={styles.sectionTitle}>Estatísticas</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{user.gamesPlayed}</Text>
            <Text style={styles.statLabel}>Jogos</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{user.wins}</Text>
            <Text style={styles.statLabel}>Vitórias</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{user.losses}</Text>
            <Text style={styles.statLabel}>Derrotas</Text>
          </View>
        </View>
      </Pressable>

      <View style={styles.upcomingGames}>
        <Text style={styles.sectionTitle}>Próximos Jogos</Text>
        <Pressable>
          <Text>{upcomingGames[0].id}</Text>
          <Text>{upcomingGames[0].date}</Text>
          <Text>{upcomingGames[0].opponent}</Text>
          <Text>{upcomingGames[0].time}</Text>
        </Pressable>
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
