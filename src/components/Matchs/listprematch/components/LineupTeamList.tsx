import React from "react";
import { View, Text, FlatList } from "react-native";
import { LineupPlayerItem } from "./LineupPlayerItem";
import { TeamPlayer } from "../types";
import lineupstyles from "../styles/lineupstyles";

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
    <View style={lineupstyles.teamContainer}>
      <Text
        style={[
          lineupstyles.teamTitle,
          {
            borderBottomColor: teamColor,
            borderBottomWidth: 2,
          },
        ]}
      >
        {teamName}
      </Text>

      <Text style={lineupstyles.teamRating}>
        Nota Média:{" "}
        {[...players, ...substitutes]
          .reduce((sum, player) => sum + (player.rating || 0), 0)
          .toFixed(1)}
      </Text>

      <View style={{ flex: 1, paddingHorizontal: 0 }}>
        <FlatList
          data={players}
          renderItem={({ item }) => (
            <LineupPlayerItem
              player={item}
              teamColor={teamColor}
              isSubstitute={false}
            />
          )}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          contentContainerStyle={lineupstyles.playersList}
        />
      </View>

      {substitutes.length > 0 && (
        <>
          <Text style={[lineupstyles.substitutesTitle]}>SUPLENTES</Text>
          <FlatList
            data={substitutes}
            renderItem={({ item }) => (
              <LineupPlayerItem
                player={item}
                teamColor={teamColor}
                isSubstitute={true}
              />
            )}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            contentContainerStyle={lineupstyles.playersList}
          />
        </>
      )}
    </View>
  );
};
