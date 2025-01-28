import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Modal,
  ScrollView,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

type Position = {
  id: number;
  position_name: string;
};

type PlayerCardProps = {
  player: any;
  positions: Position[];
  initialRating: string;
  initialPosition: string;
  onDataChange: (field: "rating" | "position", value: string) => void;
};

export default function PlayerCard({
  player,
  positions,
  initialRating,
  initialPosition,
  onDataChange,
}: PlayerCardProps) {
  const [showPositionModal, setShowPositionModal] = useState(false);
  const [rating, setRating] = useState(initialRating.replace(".", ","));
  const [position, setPosition] = useState(initialPosition);

  useEffect(() => {
    setRating(initialRating.replace(".", ","));
    setPosition(initialPosition);
  }, [initialRating, initialPosition]);

  const handleRatingChange = (text: string) => {
    let sanitizedText = text.replace(/[^0-9,]/g, "");

    const commaCount = (sanitizedText.match(/,/g) || []).length;
    if (commaCount > 1) {
      return;
    }

    setRating(sanitizedText);

    if (sanitizedText !== "," && sanitizedText !== "") {
      const numericValue = parseFloat(sanitizedText.replace(",", "."));
      if (!isNaN(numericValue)) {
        const clampedValue = Math.min(10, Math.max(0, numericValue));
        onDataChange("rating", clampedValue.toString());
      }
    }
  };
  const selectPosition = (posId: string) => {
    setPosition(posId);
    onDataChange("position", posId);
    setShowPositionModal(false);
  };

  const getPositionName = () => {
    return (
      positions.find((p) => p.id.toString() === position)?.position_name ||
      "Selecione"
    );
  };

  return (
    <View style={styles.card}>
      <MaterialIcons name="person" size={24} color="#2ecc71" />

      <Text style={styles.name} numberOfLines={1}>
        {player.profiles.name}
      </Text>

      <TouchableOpacity
        style={styles.positionButton}
        onPress={() => setShowPositionModal(true)}
      >
        <Text style={styles.positionText}>{getPositionName()}</Text>
        <MaterialIcons name="arrow-drop-down" size={24} color="#666" />
      </TouchableOpacity>

      <TextInput
        style={styles.ratingInput}
        value={rating}
        keyboardType="numeric"
        placeholder="0,0"
        onChangeText={handleRatingChange}
        maxLength={4}
      />

      <PositionModal
        visible={showPositionModal}
        positions={positions}
        onSelect={selectPosition}
        onClose={() => setShowPositionModal(false)}
      />
    </View>
  );
}

const PositionModal = ({
  visible,
  positions,
  onSelect,
  onClose,
}: {
  visible: boolean;
  positions: Position[];
  onSelect: (positionId: string) => void;
  onClose: () => void;
}) => (
  <Modal visible={visible} transparent animationType="slide">
    <TouchableOpacity
      style={styles.modalOverlay}
      activeOpacity={1}
      onPress={onClose}
    >
      <View style={styles.modalContent}>
        <ScrollView>
          {positions.map((pos) => (
            <TouchableOpacity
              key={pos.id}
              style={styles.positionItem}
              onPress={() => onSelect(pos.id.toString())}
            >
              <Text style={styles.positionItemText}>{pos.position_name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </TouchableOpacity>
  </Modal>
);

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  name: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: "#333",
  },
  positionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 6,
    padding: 8,
    marginHorizontal: 8,
    minWidth: 100,
  },
  positionText: {
    color: "#333",
    fontSize: 14,
  },
  ratingInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 6,
    padding: 8,
    width: 70,
    textAlign: "center",
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 8,
    maxHeight: "60%",
    width: "80%",
  },
  positionItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  positionItemText: {
    fontSize: 16,
    color: "#333",
  },
});
