import { useConfirmedPlayers, usePositions } from "@/api/club_members";

import { useLocalSearchParams } from "expo-router";
import React from "react";
import { FlatList, StyleSheet } from "react-native";
import PlayerCard from "./player_card";

export default function OrganizationTab() {
  const { id } = useLocalSearchParams();
  const matchId = Array.isArray(id) ? id[0] : id;

  const { data: confirmedPlayers } = useConfirmedPlayers(matchId);
  const { data: positions } = usePositions();

  return (
    <FlatList
      data={confirmedPlayers}
      renderItem={({ item }) => (
        <PlayerCard
          player={item}
          clubId={matchId}
          positions={positions || []}
        />
      )}
      contentContainerStyle={styles.listContainer}
      keyExtractor={(item) => item.player_id}
    />
  );
}

const styles = StyleSheet.create({
  listContainer: { padding: 16 },
});
