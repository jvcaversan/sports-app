import React from "react";
import { View, Text } from "react-native";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import lineupstyles from "../styles/lineupstyles";
import { TeamPlayer } from "../types";

interface LineupPlayerItemProps {
  player: TeamPlayer;
  teamColor: string;
  isSubstitute: boolean;
  onMoveToSubstitutes?: (playerId: string) => void;
}

export const LineupPlayerItem = ({
  player,
  teamColor,
  isSubstitute,
  onMoveToSubstitutes,
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
          color="#FFB74D"
          style={{ marginLeft: 4 }}
          onPress={() => onMoveToSubstitutes?.(player.id)}
        />
      )}
    </View>
  );
};
