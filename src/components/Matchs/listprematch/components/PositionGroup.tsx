import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { TeamPlayer } from "../types";
import { AntDesign } from "@expo/vector-icons";

type PositionGroupProps = {
  position: string;
  players: TeamPlayer[];
  abbreviation: string;
  required: number;
  teamColor: string;
  onRemovePlayer?: (player: TeamPlayer) => void;
  onSlotPress?: (position: string) => void;
  isEditing?: boolean;
};

export default function PositionGroup({
  position,
  players,
  abbreviation,
  required,
  teamColor,
  onRemovePlayer,
  onSlotPress,
  isEditing,
}: PositionGroupProps) {
  return (
    <View style={styles.positionGroup}>
      {Array.from({ length: required }).map((_, index) => {
        const player = players[index];
        return (
          <View key={`${position}-${index}`} style={styles.playerRow}>
            <View
              style={{ flexDirection: "row", alignItems: "center", flex: 1 }}
            >
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
                <TouchableOpacity
                  onPress={
                    isEditing ? () => onSlotPress?.(position) : undefined
                  }
                  disabled={!isEditing}
                >
                  <Text
                    style={[
                      styles.playerName,
                      styles.availableSlot,
                      !isEditing && styles.disabledSlot,
                    ]}
                  >
                    Vaga disponível
                  </Text>
                </TouchableOpacity>
              )}
            </View>
            {player && (
              <TouchableOpacity
                onPress={isEditing ? () => onRemovePlayer?.(player) : undefined}
                disabled={!isEditing}
                style={{ padding: 4 }}
              >
                <AntDesign
                  name="closecircle"
                  size={18}
                  color={isEditing ? "#FF6B00" : "#95a5a6"}
                />
              </TouchableOpacity>
            )}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
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
  disabledSlot: {
    color: "#bdc3c7",
  },
});
