import { Modal, View, Text, Pressable, StyleSheet } from "react-native";
import { Jogador } from "@/src/types/types";

interface PlayerSelectionModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSelect: (player: Jogador) => void;
  players: Jogador[];
  position: string;
  selectedPlayers?: Jogador[];
}

export function PlayerSelectionModal({
  isVisible,
  onClose,
  onSelect,
  players,
  position,
  selectedPlayers = [],
}: PlayerSelectionModalProps) {
  const handlePlayerSelect = (player: Jogador) => {
    onSelect(player);
    onClose();
  };

  return (
    <Modal visible={isVisible} transparent>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Selecione o {position}</Text>
          {players.map((player) => {
            const isSelected = selectedPlayers.some((p) => p?.id === player.id);
            return (
              <Pressable
                key={player.id}
                onPress={() => !isSelected && handlePlayerSelect(player)}
                style={[
                  styles.playerItem,
                  isSelected && styles.playerItemDisabled,
                ]}
                disabled={isSelected}
              >
                <Text
                  style={[
                    styles.playerText,
                    isSelected && styles.playerTextDisabled,
                  ]}
                >
                  {player.nome}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "80%",
    padding: 20,
    backgroundColor: "white",
    borderRadius: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  playerItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    width: "100%",
  },
  playerItemDisabled: {
    backgroundColor: "#f0f0f0",
    opacity: 0.7,
  },
  playerText: {
    fontSize: 16,
  },
  playerTextDisabled: {
    textDecorationLine: "line-through",
    color: "#999",
  },
});
