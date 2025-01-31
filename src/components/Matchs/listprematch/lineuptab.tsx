import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  Modal,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useConfirmedPlayers, usePlayerRatings } from "@/api/club_members";
import { MaterialIcons, AntDesign } from "@expo/vector-icons";
import { Tables } from "@/types/supabase";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/database/supabase";

type PlayerRating = Tables<"player_ratings">;

type TeamPlayer = {
  id: string;
  name: string;
  position: PlayerRating["position"];
  rating: number;
};

type PositionConfig = {
  abbreviation: string;
  quantity: number;
  order: number;
};

const POSITION_CONFIG: Record<string, PositionConfig> = {
  GOL: { abbreviation: "GOL", quantity: 1, order: 0 },
  LAD: { abbreviation: "LAD", quantity: 1, order: 1 },
  ZAG: { abbreviation: "ZAG", quantity: 2, order: 2 },
  LAE: { abbreviation: "LAE", quantity: 1, order: 3 },
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
  teamColor,
  onRemovePlayer,
  onSlotPress,
}: {
  position: string;
  players: TeamPlayer[];
  abbreviation: string;
  required: number;
  teamColor: string;
  onRemovePlayer: (player: TeamPlayer) => void;
  onSlotPress: (position: string) => void;
}) => (
  <View style={styles.positionGroup}>
    {Array.from({ length: required }).map((_, index) => {
      const player = players[index];
      return (
        <View key={`${position}-${index}`} style={styles.playerRow}>
          <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
            <Text style={styles.positionText}>{abbreviation}</Text>
            {player ? (
              <Text style={[styles.playerName, { color: teamColor }]}>
                {player.name}
              </Text>
            ) : (
              <TouchableOpacity onPress={() => onSlotPress(position)}>
                <Text style={[styles.playerName, { color: teamColor }]}>
                  Vaga disponível
                </Text>
              </TouchableOpacity>
            )}
          </View>
          {player && (
            <TouchableOpacity
              onPress={() => onRemovePlayer(player)}
              style={{ padding: 4 }}
            >
              <AntDesign name="closecircle" size={18} color="#ff4444" />
            </TouchableOpacity>
          )}
        </View>
      );
    })}
  </View>
);

const TeamColumn = ({
  team,
  total,
  title,
  teamColor,
  onRemovePlayer,
  teamType,
  onSlotPress,
  substitutes,
}: {
  team: TeamPlayer[];
  total: number;
  title: string;
  teamColor: string;
  onRemovePlayer: (player: TeamPlayer) => void;
  teamType: "teamA" | "teamB";
  onSlotPress: (position: string) => void;
  substitutes: TeamPlayer[];
}) => (
  <View style={[styles.teamColumn, { paddingVertical: 8 }]}>
    <Text
      style={[
        styles.teamTitle,
        { color: teamColor, marginBottom: 16, paddingHorizontal: 8 },
      ]}
    >
      {title}
    </Text>
    <View style={{ flex: 1 }}>
      {Object.entries(POSITION_CONFIG).map(([position, config]) => (
        <PositionGroup
          key={position}
          position={position}
          players={team.filter((p) => p.position === position)}
          abbreviation={config.abbreviation}
          required={config.quantity}
          teamColor={teamColor}
          onRemovePlayer={onRemovePlayer}
          onSlotPress={onSlotPress}
        />
      ))}
      <View style={styles.totalContainer}>
        <Text style={styles.totalRating}>{total.toFixed(1)}</Text>
      </View>
      <View style={styles.substitutesContainer}>
        <Text style={styles.subtitle}>Suplentes</Text>
        {substitutes.length > 0 ? (
          substitutes.map((player) => (
            <View key={player.id} style={styles.substitutePlayer}>
              <Text style={styles.substitutePlayerText}>{player.name}</Text>
              <Text style={styles.positionText}>{player.position}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.emptySubstitutesText}>Sem suplentes</Text>
        )}
      </View>
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

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState<string | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<"teamA" | "teamB" | null>(
    null
  );

  const mapPlayers = useCallback((): TeamPlayer[] => {
    if (!confirmedPlayers || !existingRatings) return [];

    return confirmedPlayers.map((player) => {
      const rating = existingRatings.find(
        (r) => r.player_id === player.player_id
      );
      return {
        id: player.player_id,
        name: player.profiles.name,
        position: rating?.position || "MEI",
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

  const handleRemovePlayer = (player: TeamPlayer) => {
    setTeams((prev) => {
      if (!prev) return null;

      const sourceTeam = prev.teamA.includes(player) ? "teamA" : "teamB";
      const newSourceTeam = prev[sourceTeam].filter((p) => p.id !== player.id);

      return {
        ...prev,
        [sourceTeam]: newSourceTeam,
        totalA:
          sourceTeam === "teamA"
            ? calculateTeamTotal(newSourceTeam)
            : prev.totalA,
        totalB:
          sourceTeam === "teamB"
            ? calculateTeamTotal(newSourceTeam)
            : prev.totalB,
      };
    });
  };

  const handleAddPlayer = (player: TeamPlayer) => {
    if (!selectedTeam || !selectedPosition || !teams) return;

    const currentPlayersInPosition = teams[selectedTeam].filter(
      (p) => p.position === selectedPosition
    ).length;
    const required = POSITION_CONFIG[selectedPosition].quantity;

    if (currentPlayersInPosition >= required) {
      Alert.alert("Posição lotada", "Não há vagas disponíveis nesta posição.");
      setModalVisible(false);
      return;
    }

    const isInAnyTeam =
      teams.teamA.some((p) => p.id === player.id) ||
      teams.teamB.some((p) => p.id === player.id);

    if (isInAnyTeam) {
      Alert.alert("Jogador já escalado", "Este jogador já está em um time.");
      return;
    }

    const newTeam = [...teams[selectedTeam], player];
    setTeams((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        [selectedTeam]: newTeam,
        totalA:
          selectedTeam === "teamA" ? calculateTeamTotal(newTeam) : prev.totalA,
        totalB:
          selectedTeam === "teamB" ? calculateTeamTotal(newTeam) : prev.totalB,
      };
    });

    setModalVisible(false);
  };

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
      <ScrollView
        contentContainerStyle={[styles.scrollContainer]}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.teamsContainer}>
          {teams && (
            <>
              <TeamColumn
                team={teams.teamA}
                total={teams.totalA}
                title={matchData?.team1 || "Time 1"}
                teamColor={teamAColor}
                onRemovePlayer={handleRemovePlayer}
                teamType="teamA"
                onSlotPress={(position) => {
                  setSelectedPosition(position);
                  setSelectedTeam("teamA");
                  setModalVisible(true);
                }}
                substitutes={mapPlayers().filter(
                  (p) =>
                    !teams.teamA.some((t) => t.id === p.id) &&
                    !teams.teamB.some((t) => t.id === p.id)
                )}
              />
              <View style={styles.separator} />
              <TeamColumn
                team={teams.teamB}
                total={teams.totalB}
                title={matchData?.team2 || "Time 2"}
                teamColor={teamBColor}
                onRemovePlayer={handleRemovePlayer}
                teamType="teamB"
                onSlotPress={(position) => {
                  setSelectedPosition(position);
                  setSelectedTeam("teamB");
                  setModalVisible(true);
                }}
                substitutes={mapPlayers().filter(
                  (p) =>
                    !teams.teamA.some((t) => t.id === p.id) &&
                    !teams.teamB.some((t) => t.id === p.id)
                )}
              />
            </>
          )}
        </View>
      </ScrollView>

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

      <Modal
        visible={modalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Selecionar jogador para {selectedPosition}
            </Text>

            <ScrollView
              contentContainerStyle={styles.modalScroll}
              style={styles.modalPlayersList}
            >
              {mapPlayers()
                .filter((player) => player.position === selectedPosition)
                .map((player) => {
                  const isInTeamA = teams?.teamA.some(
                    (p) => p.id === player.id
                  );
                  const isInTeamB = teams?.teamB.some(
                    (p) => p.id === player.id
                  );
                  const isSelected = isInTeamA || isInTeamB;

                  return (
                    <TouchableOpacity
                      key={player.id}
                      style={[
                        styles.modalPlayerItem,
                        isSelected && styles.disabledPlayer,
                      ]}
                      onPress={() => {
                        if (!isSelected) {
                          handleAddPlayer(player);
                        }
                      }}
                      disabled={isSelected}
                    >
                      <Text style={styles.modalPlayerName}>{player.name}</Text>
                      {isSelected && (
                        <Text style={styles.modalPlayerTeam}>
                          ({isInTeamA ? matchData?.team1 : matchData?.team2})
                        </Text>
                      )}
                    </TouchableOpacity>
                  );
                })}
            </ScrollView>

            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalCloseText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    backgroundColor: "#fff",
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 150,
  },
  teamsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    minHeight: 500,
  },
  teamColumn: {
    flex: 1,
    marginHorizontal: 4,
    paddingVertical: 8,
  },
  teamTitle: {
    fontSize: 16,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  positionGroup: {
    marginBottom: 2,
  },
  playerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
    minHeight: 32,
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
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    gap: 8,
    padding: 16,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#eee",
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
    width: 2,
    backgroundColor: "#ced4da",
    marginHorizontal: 8,
    marginVertical: 8,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    width: "100%",
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
    textAlign: "center",
    color: "#333",
  },
  modalScroll: {
    maxHeight: 300,
    marginVertical: 8,
  },
  modalPlayersList: {
    maxHeight: 300,
    marginVertical: 8,
  },
  modalPlayerItem: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#f8f9fa",
    marginBottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  modalPlayerName: {
    fontSize: 14,
    color: "#333",
  },
  modalPlayerTeam: {
    fontSize: 12,
    color: "#666",
  },
  modalCloseButton: {
    marginTop: 12,
    padding: 12,
    backgroundColor: "#e3e3e3",
    borderRadius: 8,
  },
  modalCloseText: {
    color: "#333",
    fontWeight: "600",
    textAlign: "center",
  },
  disabledPlayer: {
    opacity: 0.6,
    backgroundColor: "#e9ecef",
  },
  substitutesContainer: {
    marginTop: 16,
    padding: 8,
    backgroundColor: "#f8f9fa",
    borderRadius: 4,
  },
  substitutePlayer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  substitutePlayerText: {
    fontSize: 14,
    color: "#333",
  },
  emptySubstitutesText: {
    color: "#999",
    fontStyle: "italic",
    textAlign: "center",
    paddingVertical: 8,
  },
});
