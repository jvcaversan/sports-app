import { ScreenWrapper } from "@/src/components/screen-wrapper";
import { mockData } from "@/src/data";
import { useRouter, useLocalSearchParams, Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Pressable,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface MatchItem {
  id: number;
  nomePartida: string;
  data: string;
  horario: string;
  local: string;
  times: {
    time1: { nome: string; jogadores: any[] };
    time2: { nome: string; jogadores: any[] };
  };
}

export default function Match() {
  const { id } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const group = mockData.user.grupos.find((grupo) => grupo.id === Number(id));

  if (!group) {
    return (
      <View style={styles.container}>
        <Text>Grupo não encontrado</Text>
      </View>
    );
  }

  const renderMatchItem = ({ item }: { item: MatchItem }) => (
    <Link href={`/(user)/(matchs)/(pre-match)/${item.id}`} asChild>
      <Pressable style={styles.matchCard}>
        <View style={styles.matchContent}>
          <Text style={styles.leagueName}>Partida Amistosa</Text>

          <View style={styles.teamsContainer}>
            <View style={styles.teamInfo}>
              <Image
                source={{ uri: "https://via.placeholder.com/50" }}
                style={styles.teamLogo}
              />
              <Text style={styles.teamName}>{item.times.time1.nome}</Text>
              <Text style={styles.score}>0</Text>
            </View>

            <View style={styles.matchStatus}>
              <Text style={styles.statusText}>14:30</Text>
              <Text style={styles.dateText}>{item.data}</Text>
            </View>

            <View style={styles.teamInfo}>
              <Image
                source={{ uri: "https://via.placeholder.com/50" }}
                style={styles.teamLogo}
              />
              <Text style={styles.teamName}>{item.times.time2.nome}</Text>
              <Text style={styles.score}>0</Text>
            </View>
          </View>

          <View style={styles.matchDetails}>
            <Ionicons name="location-outline" size={14} color="#70757a" />
            <Text style={styles.detailText}>{item.local}</Text>
          </View>
        </View>
      </Pressable>
    </Link>
  );

  return (
    <ScreenWrapper style={styles.container}>
      <LinearGradient
        colors={["#1a5fb4", "#1c71d8"]}
        style={[styles.header, { paddingTop: insets.top }]}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons name="chevron-back" size={24} color="#fff" />
          </TouchableOpacity>

          <View style={styles.titleContainer}>
            <Text style={styles.groupName}>{group.nomeGrupo}</Text>
          </View>
        </View>
      </LinearGradient>

      <FlatList
        data={group.partidas}
        renderItem={renderMatchItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f2f5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 30,
    paddingBottom: 20,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: -20,
  },
  titleContainer: {
    flex: 1,
    marginHorizontal: 12,
  },
  subtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
    marginTop: 4,
  },
  groupName: {
    fontSize: 24,
    fontWeight: "700",
    color: "#fff",
  },
  listContainer: {
    padding: 16,
  },
  matchCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    marginHorizontal: 2,
  },
  matchContent: {
    alignItems: "center",
    padding: 16,
  },
  leagueName: {
    fontSize: 12,
    color: "#70757a",
    marginBottom: 8,
    fontWeight: "500",
  },
  teamsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 8,
  },
  teamInfo: {
    flex: 1,
    alignItems: "center",
    gap: 8,
  },
  teamLogo: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  teamName: {
    fontSize: 14,
    color: "#202124",
    fontWeight: "500",
    textAlign: "center",
    maxWidth: 100,
  },
  score: {
    fontSize: 20,
    fontWeight: "500",
    color: "#202124",
  },
  matchStatus: {
    alignItems: "center",
    paddingHorizontal: 12,
  },
  statusText: {
    fontSize: 16,
    color: "#c41e3a", // vermelho para jogos ao vivo
    fontWeight: "500",
  },
  dateText: {
    fontSize: 12,
    color: "#70757a",
    marginTop: 4,
  },
  matchDetails: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
    gap: 4,
  },
  detailText: {
    fontSize: 12,
    color: "#70757a",
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
});
