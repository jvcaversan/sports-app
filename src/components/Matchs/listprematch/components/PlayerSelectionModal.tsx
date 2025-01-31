import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
} from "react-native";
import { POSITION_CONFIG, TeamPlayer } from "../types";

type PositionSelectionModalProps = {
  visible: boolean;
  onClose: () => void;
  selectedPosition: string | null;
  players: TeamPlayer[];
  teams: {
    teamA: TeamPlayer[];
    teamB: TeamPlayer[];
  } | null;
  matchData?: {
    team1?: string;
    team2?: string;
  } | null;
  onSelectPlayer: (player: TeamPlayer) => void;
};

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

export default function PositionSelectionModal({
  visible,
  onClose,
  selectedPosition,
  players,
  teams,
  matchData,
  onSelectPlayer,
}: PositionSelectionModalProps) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
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
            {players
              .filter((player) => player.position === selectedPosition)
              .map((player) => {
                const isInTeamA = teams?.teamA.some((p) => p.id === player.id);
                const isInTeamB = teams?.teamB.some((p) => p.id === player.id);
                const isSelected = isInTeamA || isInTeamB;

                return (
                  <TouchableOpacity
                    key={player.id}
                    style={[
                      styles.modalPlayerItem,
                      isSelected && styles.disabledPlayer,
                    ]}
                    onPress={() => !isSelected && onSelectPlayer(player)}
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

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Fechar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
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
});
