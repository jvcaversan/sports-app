import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/database/supabase";
import { useLocalSearchParams } from "expo-router";
import {
  ScrollView,
  View,
  StyleSheet,
  ActivityIndicator,
  Text,
} from "react-native";
import { useState, useEffect } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import TeamColumn from "../listprematch/components/TeamColumn";
import { POSITION_CONFIG, TeamPlayer } from "../listprematch/types";
import LoadingIndicator from "@/components/ActivityIndicator";

export default function LiveMatchTab() {
  const { id } = useLocalSearchParams();
  const matchId = Array.isArray(id) ? id[0] : id;
  const [isLoading, setIsLoading] = useState(true);

  const { data: existingLineups } = useQuery({
    queryKey: ["match-lineups", matchId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("match_lineups")
        .select(
          `
          id, 
          team_name, 
          lineup_players (
            player_id, 
            position, 
            profiles (name)
          )`
        )
        .eq("match_id", matchId!);
      return data;
    },
  });

  const formatPlayers = (lineup: any): TeamPlayer[] => {
    return lineup.lineup_players.map((p: any) => ({
      id: p.player_id,
      name: p.profiles?.name ? formatName(p.profiles.name) : "Jogador Sem Nome",
      position: p.position,
      rating: 0,
    }));
  };

  const formatName = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingIndicator color="green" message="Carregando Escalação" />;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.matchTitle}>Escalação da Partida</Text>

      <View style={styles.teamsContainer}>
        {existingLineups?.map((lineup, index) => (
          <View key={lineup.id} style={styles.teamCard}>
            {/* Header do Time */}
            <LinearGradient
              colors={
                index === 0 ? ["#2ecc71", "#27ae60"] : ["#2D3436", "#636e72"]
              }
              style={styles.teamHeader}
            >
              <Text
                style={styles.teamName}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {lineup.team_name}
              </Text>
            </LinearGradient>

            {/* Lista de Jogadores por Posição */}
            <View style={styles.positionsContainer}>
              {Object.entries(POSITION_CONFIG)
                .sort(
                  ([a], [b]) =>
                    POSITION_CONFIG[a].order - POSITION_CONFIG[b].order
                )
                .map(([position, config]) => {
                  const players = lineup.lineup_players
                    .filter((p) => p.position === position)
                    .map((p) => ({
                      id: p.player_id,
                      name: p.profiles?.name
                        ? formatName(p.profiles.name)
                        : "Jogador",
                      position: p.position,
                    }));

                  return players.length > 0 ? (
                    <View key={position} style={styles.positionSection}>
                      {players.map((player) => (
                        <View key={player.id} style={styles.playerCard}>
                          <Text style={styles.playerName} numberOfLines={1}>
                            {player.name}
                          </Text>
                          <View
                            style={[
                              styles.positionBadge,
                              {
                                backgroundColor:
                                  index === 0 ? "#2ecc71" : "#2D3436",
                              },
                            ]}
                          >
                            <Text style={styles.positionText}>{position}</Text>
                          </View>
                        </View>
                      ))}
                    </View>
                  ) : null;
                })}
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: "#F8F9FA",
  },
  matchTitle: {
    fontSize: 24,
    fontWeight: "900",
    color: "#2D3436",
    textAlign: "center",
    marginBottom: 20,
    letterSpacing: 0.5,
  },
  teamsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    flex: 1,
  },
  teamCard: {
    flex: 1,
    minWidth: "45%",
    borderRadius: 15,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    overflow: "hidden",
  },
  teamHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 10,
  },
  teamName: {
    fontSize: 14,
    fontWeight: "800",
    color: "#FFFFFF",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    flexShrink: 1,
    textAlign: "center",
  },
  positionsContainer: {
    padding: 8,
  },
  positionSection: {
    marginBottom: 0,
  },
  positionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#7F8C8D",
    marginBottom: 12,
    paddingLeft: 8,
    borderLeftWidth: 3,
    borderLeftColor: "#2ecc71",
  },
  playerCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
    borderRadius: 6,
    padding: 6,
    marginBottom: 2,
  },
  playerNumber: {
    width: 30,
    fontSize: 14,
    fontWeight: "700",
    color: "#2D3436",
    textAlign: "center",
    marginRight: 12,
  },
  playerName: {
    flex: 1,
    fontSize: 15,
    fontWeight: "500",
    color: "#2D3436",
  },
  positionBadge: {
    borderRadius: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginLeft: 10,
  },
  positionText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.9)",
  },
});
