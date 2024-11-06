import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Pressable,
} from "react-native";
import { StyleSheet } from "react-native";
import { Link, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { ScreenWrapper } from "../../../components/screen-wrapper";
import { Platform, StatusBar } from "react-native";

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

  const renderGameItem = ({ item: game }: { item: Game }) => (
    <View style={styles.gameCard}>
      <Text style={styles.gameDate}>{game.date}</Text>
      <Text style={styles.gameInfo}>
        {game.time} - vs {game.opponent}
      </Text>
    </View>
  );

  return (
    <ScreenWrapper>
      <FlatList
        ListHeaderComponent={() => (
          <>
            {/* Header com informações do usuário */}
            <View style={styles.header}>
              <View style={styles.userInfo}>
                <Text style={styles.userName}>{user.name}</Text>
                <Link href="/perfil" asChild>
                  <TouchableOpacity>
                    <Ionicons name="settings-outline" size={24} color="#333" />
                  </TouchableOpacity>
                </Link>
              </View>
            </View>

            {/* Estatísticas do usuário */}
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
            </View>
          </>
        )}
        data={upcomingGames}
        renderItem={renderGameItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </ScreenWrapper>
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
