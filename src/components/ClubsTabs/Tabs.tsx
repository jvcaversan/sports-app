import React, { useState } from "react";
import { TabView, TabBar } from "react-native-tab-view";
import {
  StyleSheet,
  View,
  ActivityIndicator,
  Text,
  useWindowDimensions,
  TouchableOpacity,
  TextInput,
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
    const [searchQuery, setSearchQuery] = useState("");

    const handleSearchChange = (query: string) => {
      setSearchQuery(query);
    };

    const filteredMembers = members.filter((member) =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (isMembersLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#16A34A" />
          <Text style={styles.loadingText}>Carregando membros...</Text>
        </View>
      );
    }

    return (
      <View style={[styles.membersContainer, { backgroundColor: "#F8FAFC" }]}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar membro..."
          placeholderTextColor="#94A3B8"
          value={searchQuery}
          onChangeText={handleSearchChange}
        />

        <TabRoute<Tables<"club_members">>
          data={filteredMembers}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleSelectUser(item)}>
              <MemberCard member={item} />
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.player_id}
          emptyMessage="Nenhum membro encontrado"
          sectionStyle={styles.membersSection}
        />
      </View>
    );
  };

  const MatchesRoute = () => (
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
  },
  loadingText: {
    fontSize: 14,
    color: "#16A34A",
    textAlign: "center",
    marginTop: 8,
    fontFamily: "Inter-SemiBold",
  },
  membersContainer: {
    flex: 1,
    padding: 8,
  },
  searchInput: {
    height: 40,
    borderColor: "#E2E8F0",
    borderWidth: 1,
    borderRadius: 20,
    paddingLeft: 16,
    marginBottom: 4,
    backgroundColor: "#FFFFFF",
    fontSize: 14,
    color: "#1E293B",
    fontFamily: "Inter-Regular",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  membersSection: {
    flex: 1,
    paddingTop: 4,
  },
  matchesSection: {
    flex: 1,
    paddingTop: 8,
  },
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
