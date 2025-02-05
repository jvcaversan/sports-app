import React from "react";
import { View, Text, FlatList } from "react-native";
import { LineupPlayerItem } from "./LineupPlayerItem";
import { TeamPlayer } from "../types";
import LineupStyles from "../styles/lineupstyles";

interface LineupTeamListProps {
  teamName: string;
  players: TeamPlayer[];
  substitutes: TeamPlayer[];
  teamColor: string;
}

export const LineupTeamList = ({
  teamName,
  players,
  substitutes,
  teamColor,
}: LineupTeamListProps) => {
  return (
    <View style={LineupStyles.teamContainer}>
      <Text style={[LineupStyles.teamTitle, { color: teamColor }]}>
        {teamName}
      </Text>

      <Text style={[LineupStyles.teamRating, { color: teamColor }]}>
        Nota:{" "}
        {[...players, ...substitutes]
          .reduce((sum, player) => sum + (player.rating || 0), 0)
          .toFixed(1)}
      </Text>

      <FlatList
        data={players}
        renderItem={({ item }) => (
          <LineupPlayerItem player={item} teamColor={teamColor} />
        )}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
        contentContainerStyle={LineupStyles.playersList}
      />

      {substitutes.length > 0 && (
        <>
          <Text style={[LineupStyles.substitutesTitle, { color: teamColor }]}>
            Suplentes
          </Text>
          <FlatList
            data={substitutes}
            renderItem={({ item }) => (
              <LineupPlayerItem player={item} teamColor={teamColor} />
            )}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            contentContainerStyle={LineupStyles.playersList}
          />
        </>
      )}
    </View>
  );
};
