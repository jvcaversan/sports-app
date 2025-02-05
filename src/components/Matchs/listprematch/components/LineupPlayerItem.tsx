import React from "react";
import { View, Text } from "react-native";
import LineupStyles from "../styles/lineupstyles";
import { TeamPlayer } from "../types";

interface LineupPlayerItemProps {
  player: TeamPlayer;
  teamColor: string;
}

export const LineupPlayerItem = ({
  player,
  teamColor,
}: LineupPlayerItemProps) => {
  return (
    <View style={LineupStyles.playerRow}>
      <Text style={[LineupStyles.playerPosition, { color: teamColor }]}>
        {player.position?.toUpperCase() || "N/D"}
      </Text>
      <Text style={LineupStyles.playerName} numberOfLines={1}>
        {player.name.charAt(0).toUpperCase() + player.name.slice(1)}
      </Text>
    </View>
  );
};
