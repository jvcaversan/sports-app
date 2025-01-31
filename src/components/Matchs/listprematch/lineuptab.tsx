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
            <Text style={[styles.positionText, { color: teamColor }]}>
              {abbreviation}
            </Text>
            {player ? (
              <Text
                style={[styles.playerName, { color: teamColor }]}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {player.name}
              </Text>
            ) : (
              <TouchableOpacity onPress={() => onSlotPress(position)}>
                <Text style={[styles.playerName, styles.availableSlot]}>
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
              <AntDesign name="closecircle" size={18} color="#FF6B00" />
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
  <View style={[styles.teamColumn, { backgroundColor: "#FFFFFF" }]}>
    <Text
      style={[
        styles.teamTitle,
        { color: teamColor, marginBottom: 8, paddingHorizontal: 8 },
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
              <Text
                style={styles.substitutePlayerText}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {player.name
                  .split(" ")
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(" ")}
              </Text>
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

const getPositionName = (position: string | null) => {
  if (!position) return "";
  const config = POSITION_CONFIG[position];
  if (!config) return position;

  const positionNames: { [key: string]: string } = {
    GOL: "Goleiro",
    ZAG: "Zagueiro",
    LAD: "Lateral Direito",
    LAE: "Lateral Esquerdo",
    MEI: "Meia",
    ATA: "Atacante",
  };

  return `${config.abbreviation} - ${positionNames[position]}`;
};

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
    substitutesA: TeamPlayer[];
    substitutesB: TeamPlayer[];
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
        name: player.profiles.name
          .split(" ")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" "),
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
      substitutesA: [],
      substitutesB: [],
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

      const substituteKey =
        sourceTeam === "teamA" ? "substitutesA" : "substitutesB";
      const newSubstitutes = [...prev[substituteKey], player];

      return {
        ...prev,
        [sourceTeam]: newSourceTeam,
        [substituteKey]: newSubstitutes,
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

    // Check if player is in opposite team's substitutes
    const oppositeSubstitutesKey =
      selectedTeam === "teamA" ? "substitutesB" : "substitutesA";
    const isInOppositeSubstitutes = teams[oppositeSubstitutesKey].some(
      (p) => p.id === player.id
    );

    // Remove from opposite substitutes if exists
    let newOppositeSubstitutes = teams[oppositeSubstitutesKey];
    if (isInOppositeSubstitutes) {
      newOppositeSubstitutes = teams[oppositeSubstitutesKey].filter(
        (p) => p.id !== player.id
      );
    }

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

    const substituteKey =
      selectedTeam === "teamA" ? "substitutesA" : "substitutesB";
    const isInSubstitutes = teams[substituteKey].some(
      (p) => p.id === player.id
    );
    let newSubstitutes = teams[substituteKey];
    if (isInSubstitutes) {
      newSubstitutes = teams[substituteKey].filter((p) => p.id !== player.id);
    }

    const newTeam = [...teams[selectedTeam], player];
    setTeams((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        [selectedTeam]: newTeam,
        [substituteKey]: newSubstitutes,
        [oppositeSubstitutesKey]: newOppositeSubstitutes,
        totalA:
          selectedTeam === "teamA" ? calculateTeamTotal(newTeam) : prev.totalA,
        totalB:
          selectedTeam === "teamB" ? calculateTeamTotal(newTeam) : prev.totalB,
      };
    });

    setModalVisible(false);
  };

  const teamAColor = "#2ecc71";
  const teamBColor = "#2D3436";

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
                substitutes={teams.substitutesA}
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
                substitutes={teams.substitutesB}
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
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {getPositionName(selectedPosition)}
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
                      onPress={() => !isSelected && handleAddPlayer(player)}
                      disabled={isSelected}
                    >
                      <View style={styles.playerInfo}>
                        <Text style={styles.modalPlayerName}>
                          {player.name
                            .split(" ")
                            .map(
                              (word) =>
                                word.charAt(0).toUpperCase() + word.slice(1)
                            )
                            .join(" ")}
                        </Text>
                        <View style={styles.positionBadge}>
                          <Text style={styles.positionBadgeText}>
                            {POSITION_CONFIG[player.position]?.abbreviation}
                          </Text>
                        </View>
                      </View>

                      {isSelected && (
                        <Text style={styles.teamLabel}>
                          ({isInTeamA ? matchData?.team1 : matchData?.team2})
                        </Text>
                      )}
                    </TouchableOpacity>
                  );
                })}
            </ScrollView>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Fechar</Text>
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
    backgroundColor: "#FFFFFF",
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 150,
    backgroundColor: "#FFFFFF",
  },
  teamsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    minHeight: 500,
    backgroundColor: "#FFFFFF",
  },
  teamColumn: {
    flex: 1,
    marginHorizontal: 0,
    paddingVertical: 8,
    borderRadius: 0,
    backgroundColor: "#FFFFFF",
  },
  teamTitle: {
    fontSize: 16,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 8,
    paddingHorizontal: 8,
    backgroundColor: "transparent",
    paddingVertical: 4,
    borderRadius: 8,
  },
  positionGroup: {
    marginBottom: 0,
  },
  playerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 0,
    minHeight: 24,
    height: 32,
  },
  positionText: {
    width: 40,
    fontSize: 12,
    fontWeight: "700",
    lineHeight: 32,
  },
  playerName: {
    flex: 1,
    fontSize: 14,
    color: "#2D3436",
    fontWeight: "500",
    height: 32,
    lineHeight: 32,
  },
  availableSlot: {
    color: "#95a5a6",
    fontStyle: "italic",
  },
  totalContainer: {
    marginTop: 8,
    padding: 4,
    alignItems: "center",
  },
  totalRating: {
    fontSize: 16,
    fontWeight: "900",
    color: "#FF6B00",
  },
  buttonsContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    gap: 8,
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#DFE6E9",
  },
  actionButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  shuffleButton: {
    backgroundColor: "#FF6B00",
  },
  confirmButton: {
    backgroundColor: "#2ecc71",
  },
  buttonText: {
    color: "white",
    fontWeight: "800",
    fontSize: 14,
    textAlign: "center",
  },
  separator: {
    width: 1,
    backgroundColor: "grey",
    marginHorizontal: 16,
    height: "100%",
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
    color: "#000000",
    fontWeight: "600",
    marginBottom: 8,
    textAlign: "left",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(45,52,54,0.4)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    width: "90%",
    maxHeight: "70%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2c3e50",
    textAlign: "center",
    marginBottom: 20,
  },
  modalScroll: {
    maxHeight: 400,
  },
  modalPlayersList: {
    maxHeight: 400,
  },
  modalPlayerItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    marginBottom: 8,
    backgroundColor: "#F8F9FA",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#EDF2F4",
  },
  playerInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  modalPlayerName: {
    fontSize: 15,
    fontWeight: "500",
    color: "#212529",
  },
  positionBadge: {
    backgroundColor: "#E8F6EF",
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  positionBadgeText: {
    color: "#00B894",
    fontSize: 12,
    fontWeight: "700",
  },
  ratingText: {
    fontSize: 14,
    color: "#4CAF50",
    fontWeight: "700",
  },
  teamLabel: {
    fontSize: 13,
    color: "#6c757d",
    fontWeight: "600",
    fontStyle: "italic",
  },
  disabledPlayer: {
    opacity: 0.6,
    backgroundColor: "#e9ecef",
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: "#FF6B00",
    borderRadius: 8,
    padding: 14,
    alignItems: "center",
  },
  closeButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 15,
  },
  substitutesContainer: {
    marginTop: 4,
    padding: 4,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
  },
  substitutePlayer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 0,
    minHeight: 28,
  },
  substitutePlayerText: {
    fontSize: 14,
    color: "#2D3436",
    flex: 1,
    lineHeight: 32,
  },
  emptySubstitutesText: {
    color: "#95A5A6",
    fontStyle: "italic",
    textAlign: "center",
    paddingVertical: 8,
  },
});
