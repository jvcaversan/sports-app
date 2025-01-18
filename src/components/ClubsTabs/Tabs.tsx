import React from "react";
import { TabView, TabBar } from "react-native-tab-view";
import {
  StyleSheet,
  View,
  ActivityIndicator,
  Text,
  useWindowDimensions,
  TouchableOpacity,
} from "react-native";
import { TabRoute } from "@/components/ClubsTabs/TabSection";
import MatchListItem from "@/components/MatchsList";
import { Tables } from "@/types/supabase";
import { MemberCard } from "./MemberCard";

interface ClubTabsProps {
  members: Tables<"club_members">[];
  matchs: Tables<"matches">[];
  isMembersLoading: boolean;
  handleSelectUser: (user: Tables<"club_members">) => void;
}

export const ClubTabs = ({
  members = [],
  matchs = [],
  isMembersLoading,
  handleSelectUser,
}: ClubTabsProps) => {
  const layout = useWindowDimensions();
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: "members", title: "Membros" },
    { key: "matches", title: "Partidas" },
  ]);

  const MembersRoute = () => {
    if (isMembersLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3498db" />
          <Text style={styles.loadingText}>Carregando membros...</Text>
        </View>
      );
    }

    return (
      <TabRoute<Tables<"club_members">>
        data={members}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleSelectUser(item)}>
            <MemberCard member={item} />
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.player_id}
        emptyMessage="Membros não encontrados"
        sectionStyle={styles.membersSection}
      />
    );
  };

  const MatchesRoute = () => (
    <TabRoute<Tables<"matches">>
      data={matchs}
      renderItem={({ item }) => <MatchListItem match={item} />}
      keyExtractor={(item) => item.id}
      emptyMessage="Este clube ainda não possui partidas"
      sectionStyle={styles.matchesSection}
    />
  );

  const renderScene = ({ route }: { route: { key: string } }) => {
    switch (route.key) {
      case "members":
        return <MembersRoute />;
      case "matches":
        return <MatchesRoute />;
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
      activeColor="#0B4619"
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
      style={styles.tabView}
    />
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: "#3498db",
    textAlign: "center",
    marginTop: 10,
  },
  membersSection: {
    flex: 1,
    paddingTop: 16,
  },
  matchesSection: {
    flex: 1,
    paddingTop: 16,
  },
  tabView: {
    flex: 1,
  },
  tabBar: {
    backgroundColor: "#ffffff",
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    height: 45,
    marginBottom: 6,
  },
  tabIndicator: {
    backgroundColor: "#16A34A",
    height: 2,
  },
  tabLabel: {
    fontSize: 13,
    fontWeight: "600",
    textTransform: "none",
    letterSpacing: 0.3,
  },
});
