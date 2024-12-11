import { useSearchUser } from "@/api/club_invitation";
import { useClubMembers } from "@/api/club_members";
import { useClubsById, useClubsByUserId } from "@/api/clubs";
import { useMatchsByClubId } from "@/api/createMatch";
import { Ionicons } from "@expo/vector-icons";
import { Link, router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
  useWindowDimensions,
  Image,
} from "react-native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import { useProfile } from "@/api/profiles";

export default function ClubDetails() {
  const [query, setQuery] = useState(""); // Query de busca

  const { id } = useLocalSearchParams();
  const clubId = Array.isArray(id) ? id[0] : id;

  const { data: club, isLoading, isError } = useClubsById(clubId);
  const { data: members } = useClubMembers(clubId);
  const { data: matchs, error } = useMatchsByClubId(clubId);

  const {
    data: users,
    isLoading: isSearching,
    isError: errorSearch,
  } = useSearchUser(query);

  const handleChange = (text: string) => {
    setQuery(text.trim());
  };

  const handleSelectUser = (user: { id: string; name: string }) => {
    Alert.alert(`Selecionado: ${user.name} (ID: ${user.id})`);
  };

  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "members", title: "Membros" },
    { key: "matches", title: "Partidas" },
  ]);

  const MembersRoute = () => (
    <View style={styles.tabContent}>
      <View style={styles.membersSection}>
        <FlatList
          data={members}
          keyExtractor={(item) => item.player_id}
          renderItem={({ item }) => <MemberCard member={item} />}
          style={styles.memberList}
          contentContainerStyle={styles.listContentContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={() => (
            <Text style={styles.noMembersText}>
              Este clube ainda não possui membros.
            </Text>
          )}
        />
      </View>
    </View>
  );

  const MatchesRoute = () => (
    <View style={styles.tabContent}>
      <View style={styles.matchesSection}>
        <FlatList
          data={matchs}
          renderItem={renderGroupItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContentContainer}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
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

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={styles.loadingText}>Carregando...</Text>
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

  const renderGroupItem = ({
    item,
  }: {
    item: {
      id: string;
      team1: string;
      team2: string;
      local: string;
      horario: string;
      data: Date;
      createdby: string;
    };
  }) => (
    <Link href={`/(user)/clubs/(listTeams)/(partidas)/${item.id}`} asChild>
      <TouchableOpacity style={styles.matchItem}>
        <Text style={styles.matchId}>{item.id}</Text>
        <Text style={styles.matchTeams}>
          {item.team1} vs {item.team2}
        </Text>
        <Text style={styles.matchLocation}>{item.local}</Text>
        <Text style={styles.matchTime}>{item.horario}</Text>
        <Text style={styles.matchDate}>
          {new Date(item.data).toLocaleDateString()}
        </Text>
      </TouchableOpacity>
    </Link>
  );

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
                  `/(user)/clubs/(listTeams)/createMatch?clubId=${clubId}`
                );
              }}
            >
              <Ionicons name="add-circle" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.mainContent}>
          <View style={styles.searchSection}>
            <View style={styles.searchInputContainer}>
              <Ionicons
                name="search"
                size={20}
                color="#666"
                style={styles.searchIcon}
              />
              <TextInput
                value={query}
                onChangeText={handleChange}
                placeholder="Buscar por usuário"
                placeholderTextColor="#666"
                style={styles.searchInput}
              />
            </View>
            {query !== "" && !isSearching && users && (
              <View style={styles.dropdown}>
                <FlatList
                  data={users}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.dropdownItem}
                      onPress={() => handleSelectUser(item)}
                    >
                      <Text style={styles.dropdownText}>{item.name}</Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            )}
            {query.trim() !== "" && !isSearching && users?.length === 0 && (
              <Text style={styles.noResultsText}>
                Nenhum usuário encontrado para "{query}"
              </Text>
            )}
          </View>

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
  searchSection: {
    marginBottom: 8,
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
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
    backgroundColor: "#ffffff",
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
  matchItem: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  matchId: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  matchTeams: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0B4619",
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  matchLocation: {
    fontSize: 14,
    color: "#16A34A",
    marginBottom: 4,
    fontWeight: "600",
  },
  matchTime: {
    fontSize: 14,
    color: "#0B4619",
    marginBottom: 4,
    fontWeight: "500",
  },
  matchDate: {
    fontSize: 12,
    color: "#666",
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
    height: 40,
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
  tabContent: {
    flex: 1,
    backgroundColor: "#f8f9fa",
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
