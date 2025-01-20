import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React from "react";
import { router, useLocalSearchParams } from "expo-router";
import CustomScreen from "@/components/CustomView";
import { Ionicons } from "@expo/vector-icons"; // Para o ícone de voltar
import { useProfile } from "@/api/profiles";

export default function PlayerProfileScreen() {
  const { id } = useLocalSearchParams();

  const userId = id as string;

  const { data: profile } = useProfile(userId);

  const handleInviteToClub = () => {
    console.log("Convidar jogador para o clube:", profile?.name);
  };

  return (
    <CustomScreen>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Perfil do Jogador</Text>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.profileHeader}>
          <Image
            source={{
              uri: profile?.photo || "https://github.com/jvcaversan.png",
            }}
            style={styles.profileImage}
          />
          <Text style={styles.playerName}>{profile?.name}</Text>
        </View>

        {/* Estatísticas do jogador */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Estatísticas</Text>
          {/* <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{player.stats.wins}</Text>
              <Text style={styles.statLabel}>Vitórias</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{player.stats.losses}</Text>
              <Text style={styles.statLabel}>Derrotas</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{player.stats.goals}</Text>
              <Text style={styles.statLabel}>Gols</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{player.stats.assists}</Text>
              <Text style={styles.statLabel}>Assistências</Text>
            </View>
          </View> */}
        </View>

        {/* Botão para convidar o jogador para o clube */}
        <TouchableOpacity
          style={styles.inviteButton}
          onPress={handleInviteToClub}
        >
          <Text style={styles.inviteButtonText}>Convidar para o Clube</Text>
        </TouchableOpacity>
      </ScrollView>
    </CustomScreen>
  );
}

// Estilos
const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  container: {
    padding: 16,
  },
  profileHeader: {
    alignItems: "center",
    marginBottom: 24,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
  },
  playerName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  playerClub: {
    fontSize: 16,
    color: "#666",
  },
  statsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  statItem: {
    width: "48%", // Dois itens por linha
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    marginBottom: 16,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
  },
  statLabel: {
    fontSize: 14,
    color: "#666",
  },
  inviteButton: {
    backgroundColor: "#16A34A",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
  },
  inviteButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
