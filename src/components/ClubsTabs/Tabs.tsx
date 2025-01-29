import React from "react";
import { TabView, TabBar } from "react-native-tab-view";
import { StyleSheet, useWindowDimensions } from "react-native";
import { Tables } from "@/types/supabase";
import { TabMembers } from "./MemberTabs/TabMembers";
import { TabMatches } from "./MatchesTab/TabMatches";

interface ClubTabsProps {
  members: (Tables<"club_members"> & {
    profiles: Tables<"profiles"> | null;
  })[];
  matchs: Tables<"matches">[];
  isMembersLoading: boolean;
}

export const ClubTabs = ({
  members = [],
  matchs = [],
  isMembersLoading,
}: ClubTabsProps) => {
  const layout = useWindowDimensions();
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: "members", title: "Membros" },
    { key: "matches", title: "Partidas" },
  ]);

  const renderScene = ({ route }: { route: { key: string } }) => {
    switch (route.key) {
      case "members":
        return (
          <TabMembers members={members} isMembersLoading={isMembersLoading} />
        );
      case "matches":
        return <TabMatches matchs={matchs} />;
      default:
        return null;
    }
  };

  const renderTabBar = (props: any) => (
    <TabBar
      {...props}
      indicatorStyle={styles.tabIndicator}
      style={styles.tabBar}
      labelStyle={styles.tabLabel}
      activeColor="#16A34A"
      inactiveColor="#64748B"
    />
  );

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
      renderTabBar={renderTabBar}
      style={[styles.tabView, { backgroundColor: "#F8FAFC" }]}
    />
  );
};

const styles = StyleSheet.create({
  tabView: {
    flex: 1,
  },
  tabBar: {
    backgroundColor: "#FFFFFF",
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
    height: 40,
    marginBottom: 4,
  },
  tabIndicator: {
    backgroundColor: "#16A34A",
    height: 3,
  },
  tabLabel: {
    fontSize: 14,
    fontWeight: "600",
    textTransform: "none",
    letterSpacing: 0.3,
    fontFamily: "Inter-SemiBold",
  },
});
