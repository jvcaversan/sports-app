import React, { useState, useCallback } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useConfirmedPlayers, usePlayerRatings } from "@/api/club_members";
import { MaterialIcons } from "@expo/vector-icons";
import { Tables } from "@/types/supabase";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/database/supabase";

type PlayerRating = Tables<"player_ratings">;

interface TeamPlayer {
  id: string;
  name: string;
  position: PlayerRating["position"];
  rating: number;
}

type PositionConfig = {
  abbreviation: string;
  quantity: number;
  order: number;
};

const POSITION_CONFIG: Record<string, PositionConfig> = {
  GOL: { abbreviation: "GOL", quantity: 1, order: 0 },
  LAD: { abbreviation: "LAD", quantity: 1, order: 1 },
  LAE: { abbreviation: "LAE", quantity: 1, order: 2 },
  ZAG: { abbreviation: "ZAG", quantity: 2, order: 3 },
  MEI: { abbreviation: "MEI", quantity: 3, order: 4 },
  ATA: { abbreviation: "ATA", quantity: 3, order: 5 },
} as const;

const sortPlayersByPosition = (players: TeamPlayer[]) => {
  return [...players].sort((a, b) => {
    const aOrder = POSITION_CONFIG[a.position].order;
    const bOrder = POSITION_CONFIG[b.position].order;
    return aOrder - bOrder;
  });
};

const PositionGroup = ({
  position,
  players,
  abbreviation,
  required,
}: {
  position: string;
  players: TeamPlayer[];
  abbreviation: string;
  required: number;
}) => (
  <View style={styles.positionGroup}>
    {Array.from({ length: required }).map((_, index) => (
      <View key={`${position}-${index}`} style={styles.playerRow}>
        <Text style={styles.positionText}>{abbreviation}</Text>
        <Text style={styles.playerName}>
          {players[index]?.name
            ? players[index].name.charAt(0).toUpperCase() +
              players[index].name.slice(1).toLowerCase()
            : "Vaga disponível"}
        </Text>
      </View>
    ))}
  </View>
);

const TeamColumn = ({
  team,
  total,
  title,
  teamColor,
}: {
  team: TeamPlayer[];
  total: number;
  title: string;
  teamColor: string;
}) => (
  <View style={[styles.teamColumn]}>
    <Text style={[styles.teamTitle, { color: teamColor }]}>{title}</Text>

    {Object.entries(POSITION_CONFIG).map(([position, config]) => (
      <PositionGroup
        key={position}
        position={position}
        players={team.filter((p) => p.position === position)}
        abbreviation={config.abbreviation}
        required={config.quantity}
      />
    ))}

    <View style={styles.totalContainer}>
      <Text style={styles.totalRating}>{total.toFixed(1)}</Text>
    </View>
  </View>
);

export default function LineUpTab() {
  const { id, clubId } = useLocalSearchParams();
  const matchId = Array.isArray(id) ? id[0] : id;
  const clubIdStr = Array.isArray(clubId) ? clubId[0] : clubId;

  const { data: confirmedPlayers } = useConfirmedPlayers(matchId);
  const { data: existingRatings } = usePlayerRatings(clubIdStr);

  const { data: matchData } = useQuery({
    queryKey: ["match", matchId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("matches")
        .select("team1, team2")
        .eq("id", matchId)
        .single();
      return data;
    },
  });

  const [teams, setTeams] = useState<{
    teamA: TeamPlayer[];
    teamB: TeamPlayer[];
    totalA: number;
    totalB: number;
  } | null>(null);

  const mapPlayers = useCallback((): TeamPlayer[] => {
    if (!confirmedPlayers || !existingRatings) return [];

    return confirmedPlayers.map((player) => {
      const rating = existingRatings.find(
        (r) => r.player_id === player.player_id
      );
      return {
        id: player.player_id,
        name: player.profiles.name,
        position: rating?.position || "Meio-Campista",
        rating: rating?.rating || 0,
      };
    });
  }, [confirmedPlayers, existingRatings]);

  const handleTeamShuffle = useCallback(() => {
    const players = mapPlayers();
    const { teamA, teamB } = distributePlayers(players);

    setTeams({
      teamA: sortPlayersByPosition(teamA),
      teamB: sortPlayersByPosition(teamB),
      totalA: calculateTeamTotal(teamA),
      totalB: calculateTeamTotal(teamB),
    });
  }, [mapPlayers]);

  const handleConfirmLineup = () => {
    Alert.alert("Escalação Confirmada", "Continue na aba Partida", [
      {
        text: "OK",
      },
    ]);
  };

  // Memoize team data to prevent unnecessary re-renders
  const teamAColor = "#2196f3";
  const teamBColor = "#f44336";

  if (!confirmedPlayers?.length) {
    return (
      <View style={styles.container}>
        <MaterialIcons name="construction" size={48} color="#f1c40f" />
        <Text style={styles.title}>Escalação em desenvolvimento</Text>
        <Text style={styles.subtitle}>
          Em breve você poderá montar seu time!
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {teams && (
        <View style={styles.teamsContainer}>
          <TeamColumn
            team={teams.teamA}
            total={teams.totalA}
            title={matchData?.team1 || "Time 1"}
            teamColor={teamAColor}
          />
          <View style={styles.separator} />
          <TeamColumn
            team={teams.teamB}
            total={teams.totalB}
            title={matchData?.team2 || "Time 2"}
            teamColor={teamBColor}
          />
        </View>
      )}

      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={[styles.actionButton, styles.shuffleButton]}
          onPress={handleTeamShuffle}
        >
          <Text style={styles.buttonText}>Sortear Times</Text>
        </TouchableOpacity>

        {teams && (
          <TouchableOpacity
            style={[styles.actionButton, styles.confirmButton]}
            onPress={handleConfirmLineup}
          >
            <Text style={styles.buttonText}>Confirmar Escalação</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const distributePlayers = (players: TeamPlayer[]) => {
  const teamA: TeamPlayer[] = [];
  const teamB: TeamPlayer[] = [];

  Object.keys(POSITION_CONFIG).forEach((position) => {
    const positionPlayers = players
      .filter((p) => p.position === position)
      .sort(() => Math.random() - 0.5);

    positionPlayers.forEach((player, index) => {
      index % 2 === 0 ? teamA.push(player) : teamB.push(player);
    });
  });

  const remainingPlayers = players.filter(
    (p) => !teamA.includes(p) && !teamB.includes(p)
  );

  remainingPlayers
    .sort(() => Math.random() - 0.5)
    .forEach((player, index) => {
      index % 2 === 0 ? teamA.push(player) : teamB.push(player);
    });

  return { teamA, teamB };
};

const calculateTeamTotal = (team: TeamPlayer[]) =>
  team.reduce((sum, p) => sum + p.rating, 0);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  teamsContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  teamColumn: {
    flex: 1,
    marginHorizontal: 4,
    backgroundColor: "#fff",
  },
  teamTitle: {
    fontSize: 16,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 8,
  },
  positionGroup: {
    marginBottom: 4,
  },
  playerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
    paddingVertical: 4,
  },
  positionText: {
    width: 40,
    fontSize: 12,
    fontWeight: "700",
    color: "#666",
  },
  playerName: {
    flex: 1,
    fontSize: 14,
    color: "#333",
    textTransform: "capitalize",
  },
  totalContainer: {
    marginTop: 8,
    padding: 4,
    alignItems: "center",
  },
  totalRating: {
    fontSize: 16,
    fontWeight: "900",
    color: "#2ecc71",
  },
  buttonsContainer: {
    flexDirection: "row",
    gap: 8,
    marginHorizontal: 20,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 20,
  },
  shuffleButton: {
    backgroundColor: "#4CAF50",
  },
  confirmButton: {
    backgroundColor: "#2196F3",
  },
  buttonText: {
    color: "white",
    fontWeight: "800",
    fontSize: 14,
    textAlign: "center",
  },
  separator: {
    width: 1,
    backgroundColor: "#dee2e6",
    marginHorizontal: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2c3e50",
    marginTop: 16,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#7f8c8d",
    marginTop: 8,
    textAlign: "center",
  },
});
