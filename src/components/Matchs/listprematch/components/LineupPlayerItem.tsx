import React from "react";
import { View, Text } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { TeamPlayer } from "../types";
import lineupstyles from "../styles/LineupStyles";

interface LineupPlayerItemProps {
  player: TeamPlayer;
  teamColor: string;
  isSubstitute: boolean;
  onMoveToSubstitutes?: (playerId: string) => void;
  isEditing: boolean;
}

export const LineupPlayerItem = ({
  player,
  teamColor,
  isSubstitute,
  onMoveToSubstitutes,
  isEditing,
}: LineupPlayerItemProps) => {
  return (
    <View style={lineupstyles.playerRow}>
      <Text style={lineupstyles.playerPosition}>
        {player.position?.slice(0, 3).toUpperCase() || "N/D"}
      </Text>
      <Text
        style={lineupstyles.playerName}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {player.name}
      </Text>
      {!isSubstitute && (
        <MaterialCommunityIcons
          name="close-circle-outline"
          size={18}
          color={isEditing ? "#FFB74D" : "#95a5a6"}
          style={{ marginLeft: 4 }}
          onPress={() => isEditing && onMoveToSubstitutes?.(player.id)}
        />
      )}
    </View>
  );
};
