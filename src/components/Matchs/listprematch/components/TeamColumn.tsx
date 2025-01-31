import React from "react";
import { View, Text, StyleSheet } from "react-native";

import { POSITION_CONFIG, TeamPlayer } from "../types";
import PositionGroup from "./PositionGroup";

type TeamColumnProps = {
  team: TeamPlayer[];
  total?: number;
  title?: string;
  teamColor: string;
  onRemovePlayer?: (player: TeamPlayer) => void;
  teamType: "teamA" | "teamB";
  onSlotPress?: (position: string) => void;
  substitutes: TeamPlayer[];
  isEditing?: boolean;
};

export default function TeamColumn({
  team,
  total,
  title,
  teamColor,
  onRemovePlayer,
  onSlotPress,
  substitutes,
  isEditing,
}: TeamColumnProps) {
  return (
    <View style={[styles.teamColumn, { backgroundColor: "#FFFFFF" }]}>
      <Text style={[styles.teamTitle, { color: teamColor }]}>{title}</Text>
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
            isEditing={isEditing}
          />
        ))}
        <View style={styles.totalContainer}>
          <Text style={styles.totalRating}>{total?.toFixed(1)}</Text>
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
                  {player.name}
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
}

const styles = StyleSheet.create({
  teamColumn: {
    flex: 1,
    marginHorizontal: 0,
    paddingVertical: 8,
    borderRadius: 0,
  },
  teamTitle: {
    fontSize: 16,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 8,
    paddingHorizontal: 8,
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
  substitutesContainer: {
    marginTop: 4,
    padding: 4,
    alignItems: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#000000",
    fontWeight: "600",
    marginBottom: 8,
    textAlign: "left",
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
  positionText: {
    width: 40,
    fontSize: 12,
    fontWeight: "700",
  },
});
