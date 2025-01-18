import { useClubMembersByQuery } from "@/api/club_members";
import { TabRoute } from "@/components/ClubsTabs/TabSection";
import MatchListItem from "@/components/MatchsList";
import { useClubDetails } from "@/hooks/Clubs/ClubDetails";
import { Tables } from "@/types/supabase";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  useWindowDimensions,
  Image,
  TextInput,
} from "react-native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";

export default function ClubDetails() {
  const { id } = useLocalSearchParams();
  const clubId = Array.isArray(id) ? id[0] : id;
  const [searchQuery, setSearchQuery] = useState("");

  const { club, members, matchs, isLoading, isError } = useClubDetails(clubId);
  const { data: filteredMembers, isLoading: isMembersLoading } =
    useClubMembersByQuery(clubId, searchQuery);

  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "members", title: "Membros" },
    { key: "matches", title: "Partidas" },
  ]);

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

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
      <TabRoute
        data={filteredMembers || members}
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
    <TabRoute
      data={matchs}
      renderItem={({ item }) => <MatchListItem match={item} />}
      keyExtractor={(item) => item.id}
      emptyMessage="Este clube ainda não possui partidas"
      sectionStyle={styles.matchesSection}
    />
  );

  const renderScene = SceneMap({
    members: MembersRoute,
    matches: MatchesRoute,
  });

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

  const handleSelectUser = (user: Tables<"club_members">) => {
    console.log(
      `clicado no usuario com id = ${user.player_id}, nome: ${user.name}`
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={styles.loadingText}>Carregando clube...</Text>
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Erro ao carregar o clube.</Text>
      </SafeAreaView>
    );
  }

  if (!club) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Clube não encontrado.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.headerLeft}>
              <Text style={styles.clubName}>{club.name}</Text>
            </View>
            <TouchableOpacity
              style={styles.createMatchButton}
              onPress={() => {
                router.navigate(
                  `/(user)/(clubs)/(listTeams)/createMatch?clubId=${clubId}`
                );
              }}
            >
              <Ionicons name="add-circle" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.mainContent}>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar membro..."
            value={searchQuery}
            onChangeText={handleSearchChange}
          />

          <TabView
            navigationState={{ index, routes }}
            renderScene={renderScene}
            onIndexChange={setIndex}
            initialLayout={{ width: layout.width }}
            renderTabBar={renderTabBar}
            style={styles.tabView}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const MemberCard = ({ member }: { member: any }) => {
  return (
    <View style={styles.memberCard}>
      <View style={styles.memberAvatar}>
        <Image
          source={{ uri: member.photo || "https://github.com/jvcaversan.png" }}
          style={styles.avatarImage}
          defaultSource={{
            uri: member.photo || "https://github.com/jvcaversan.png",
          }}
        />
      </View>
      <View style={styles.memberInfo}>
        <Text style={styles.memberName}>{member.name}</Text>
        <Text style={styles.memberRole}>{member.role}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F4F6F8",
  },
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: "#0B4619",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#0a3d15",
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerLeft: {
    flex: 1,
  },
  clubName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
    letterSpacing: 0.3,
  },
  createMatchButton: {
    backgroundColor: "#16A34A",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  mainContent: {
    flex: 1,
    padding: 12,
    paddingTop: 8,
  },
  searchInput: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 10,
    marginBottom: 15,
  },
  searchIcon: {
    marginRight: 10,
  },
  dropdown: {
    position: "absolute",
    top: 60,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    zIndex: 10,
    maxHeight: 200,
  },
  dropdownItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  dropdownText: {
    fontSize: 16,
    color: "#333",
  },
  noResultsText: {
    marginTop: 10,
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2c3e50",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  membersSection: {
    flex: 1,
    paddingTop: 16,
  },
  memberList: {
    flex: 1,
  },
  memberCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    padding: 14,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  memberAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#0B4619",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
    overflow: "hidden",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    borderRadius: 25,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2c3e50",
  },
  memberRole: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  noMembersText: {
    fontSize: 14,
    color: "#666",
    fontStyle: "italic",
    textAlign: "center",
    padding: 20,
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    marginTop: 8,
  },
  matchesSection: {
    flex: 1,
    paddingTop: 16,
  },
  matchesList: {
    paddingBottom: 20,
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

  loadingText: {
    fontSize: 16,
    color: "#3498db",
    textAlign: "center",
    marginTop: 10,
  },
  errorText: {
    fontSize: 16,
    color: "#e74c3c",
    textAlign: "center",
    marginTop: 10,
  },
  listContentContainer: {
    padding: 16,
    paddingTop: 8,
  },
});
