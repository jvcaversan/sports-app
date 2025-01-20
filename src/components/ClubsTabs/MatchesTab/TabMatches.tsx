import React from "react";
import { View, StyleSheet } from "react-native";
import { TabRoute } from "@/components/ClubsTabs/TabSection";
import { Tables } from "@/types/supabase";
import MatchListItem from "@/components/MatchsList";

interface MatchesRouteProps {
  matchs: Tables<"matches">[];
}

export const TabMatches = ({ matchs }: MatchesRouteProps) => (
  <View style={{ flex: 1, backgroundColor: "#F8FAFC" }}>
    <TabRoute<Tables<"matches">>
      data={matchs}
      renderItem={({ item }) => <MatchListItem match={item} />}
      keyExtractor={(item) => item.id}
      emptyMessage="Nenhuma partida encontrada"
      sectionStyle={styles.matchesSection}
    />
  </View>
);

const styles = StyleSheet.create({
  matchesSection: {
    flex: 1,
    paddingTop: 8,
  },
});
