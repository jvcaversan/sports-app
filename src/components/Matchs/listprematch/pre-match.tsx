import React, { useState, useCallback } from "react";
import { useConfirmedPlayers } from "@/api/club_members";
import { useLocalSearchParams } from "expo-router";
import { View, StyleSheet, Dimensions } from "react-native";
import { TabView, TabBar } from "react-native-tab-view";
import LoadingIndicator from "@/components/ActivityIndicator";
import OrganizationTab from "./organizationtab";
import LineUpTab from "./lineuptab";
import { ErrorState } from "@/components/Erros/ErroState";

export default function PreMatch() {
  const { id } = useLocalSearchParams();
  const matchId = Array.isArray(id) ? id[0] : id;
  const { data: players = [], isLoading, error } = useConfirmedPlayers(matchId);
  const [tabIndex, setTabIndex] = useState(0);
  const [routes] = useState([
    { key: "organization", title: "Organização" },
    { key: "lineup", title: "Escalação" },
  ]);

  const renderScene = useCallback(
    ({ route }: { route: { key: string } }) => {
      switch (route.key) {
        case "organization":
          return <OrganizationTab />;
        case "lineup":
          return <LineUpTab />;
        default:
          return null;
      }
    },
    [players]
  );

  return (
    <View style={styles.container}>
      {isLoading ? (
        <LoadingIndicator />
      ) : error ? (
        <ErrorState message="Erro ao Carregar" />
      ) : (
        <TabView
          navigationState={{ index: tabIndex, routes }}
          renderScene={renderScene}
          onIndexChange={setTabIndex}
          initialLayout={{ width: Dimensions.get("window").width }}
          renderTabBar={(props) => (
            <TabBar
              {...props}
              style={styles.tabBar}
              indicatorStyle={styles.tabIndicator}
              activeColor="#2ecc71"
              inactiveColor="#95a5a6"
            />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa" },
  tabBar: {
    backgroundColor: "white",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tabIndicator: {
    backgroundColor: "#2ecc71",
    height: 3,
    borderRadius: 2,
  },
  tabLabel: { fontSize: 14, fontWeight: "600", textTransform: "uppercase" },
});
