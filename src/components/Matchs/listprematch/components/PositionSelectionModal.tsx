import {
  Modal,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { TeamPlayer } from "../types";
import lineupstyles from "../styles/LineupStyles";

interface PositionSelectionModalProps {
  visible: boolean;
  players: TeamPlayer[];
  position: string;
  teamColor: string;
  onSelectPlayer: (player: TeamPlayer) => void;
  onClose: () => void;
}

export const PositionSelectionModal = ({
  visible,
  players,
  position,
  teamColor,
  onSelectPlayer,
  onClose,
}: PositionSelectionModalProps) => {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.backdrop}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Selecionar {position}</Text>
            <TouchableOpacity onPress={onClose}>
              <MaterialCommunityIcons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <FlatList
            data={players}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.playerItem}
                onPress={() => onSelectPlayer(item)}
              >
                <Text style={lineupstyles.playerName}>{item.name}</Text>
                <View
                  style={[
                    styles.ratingBadge,
                    { backgroundColor: teamColor + "20" },
                  ]}
                >
                  <Text style={[styles.ratingText, { color: teamColor }]}>
                    {item.rating.toFixed(1)}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <Text style={styles.emptyText}>
                Nenhum jogador disponível nesta posição
              </Text>
            }
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    backgroundColor: "white",
    borderRadius: 16,
    width: "90%",
    maxHeight: "80%",
    padding: 16,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2d3436",
  },
  playerItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  ratingBadge: {
    backgroundColor: "#e8f5e9",
    borderRadius: 4,
    paddingVertical: 2,
    paddingHorizontal: 8,
  },
  ratingText: {
    color: "#2ecc71",
    fontWeight: "700",
    fontSize: 14,
  },
  emptyText: {
    textAlign: "center",
    color: "#7f8c8d",
    marginVertical: 16,
  },
});
