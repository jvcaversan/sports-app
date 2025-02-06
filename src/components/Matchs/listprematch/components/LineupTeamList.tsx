import React, { useState } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { LineupPlayerItem } from "./LineupPlayerItem";
import { TeamPlayer, POSITION_CONFIG } from "../types";
import lineupstyles from "../styles/LineupStyles";
import { PositionSelectionModal } from "./PositionSelectionModal";

interface LineupTeamListProps {
  teamName: string;
  players: TeamPlayer[];
  substitutes: TeamPlayer[];
  teamColor: string;
  onMoveToSubstitutes: (playerId: string) => void;
  onAddToStarters: (playerId: string, position: string) => void;
  allSubstitutes: TeamPlayer[];
  isEditing: boolean;
}

export const LineupTeamList = ({
  teamName,
  players,
  substitutes,
  teamColor,
  onMoveToSubstitutes,
  onAddToStarters,
  allSubstitutes,
  isEditing,
}: LineupTeamListProps) => {
  const [isPositionModalVisible, setIsPositionModalVisible] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState("");

  const handlePositionSelect = (player: TeamPlayer) => {
    onAddToStarters(player.id, player.position);
    setIsPositionModalVisible(false);
  };

  const generatePositionSlots = () => {
    const slots = [];

    for (const [position, config] of Object.entries(POSITION_CONFIG)) {
      const positionPlayers = players.filter((p) => p.position === position);

      for (let i = 0; i < config.quantity; i++) {
        const player = positionPlayers[i];
        slots.push({
          position,
          player,
          isPlaceholder: !player,
        });
      }
    }

    return slots;
  };

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
          data={generatePositionSlots()}
          renderItem={({ item }) =>
            item.player ? (
              <LineupPlayerItem
                player={item.player}
                teamColor={teamColor}
                isSubstitute={false}
                onMoveToSubstitutes={onMoveToSubstitutes}
                isEditing={isEditing}
              />
            ) : (
              <TouchableOpacity
                style={lineupstyles.playerRow}
                onPress={() => {
                  setSelectedPosition(item.position);
                  setIsPositionModalVisible(true);
                }}
              >
                <Text style={lineupstyles.playerPosition}>
                  {item.position.slice(0, 3).toUpperCase()}
                </Text>
                <Text style={lineupstyles.placeholderText}>
                  VAGA DISPONÍVEL
                </Text>
              </TouchableOpacity>
            )
          }
          keyExtractor={(item, index) =>
            item.player?.id || `${item.position}-${index}`
          }
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
                onMoveToSubstitutes={onMoveToSubstitutes}
                isEditing={isEditing}
              />
            )}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            contentContainerStyle={lineupstyles.playersList}
          />
        </>
      )}

      <PositionSelectionModal
        visible={isPositionModalVisible}
        players={allSubstitutes.filter((p) => p.position === selectedPosition)}
        position={selectedPosition}
        teamColor={teamColor}
        onSelectPlayer={handlePositionSelect}
        onClose={() => setIsPositionModalVisible(false)}
      />
    </View>
  );
};
