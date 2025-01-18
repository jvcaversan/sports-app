import { Link } from "expo-router";
import { Text, TouchableOpacity, StyleSheet, View } from "react-native";
import { Tables } from "@/types/supabase";
import { Ionicons } from "@expo/vector-icons";

type MatchListItemProps = {
  match?: Omit<Tables<"matches">, "clubid">;
};

export default function MatchListItem({ match }: MatchListItemProps) {
  if (!match) {
    return (
      <View style={styles.matchItemUnavailable}>
        <Text style={styles.matchUnavailableText}>Partida não disponível</Text>
      </View>
    );
  }

  return (
    <Link
      href={`/(user)/(clubs)/(listTeams)/(partidas)/${match.id || "unknown"}`}
      asChild
    >
      <TouchableOpacity
        style={styles.matchItem}
        accessible
        accessibilityLabel={`Partida entre ${match.team1} e ${match.team2}`}
        accessibilityRole="button"
      >
        {/* Cabeçalho da Partida */}
        <View style={styles.matchHeader}>
          <Text style={styles.matchTeams}>
            {match.team1 || "Time 1"} vs {match.team2 || "Time 2"}
          </Text>
        </View>

        {/* Detalhes da Partida */}
        <View style={styles.matchDetails}>
          <View style={styles.detailItem}>
            <Ionicons name="location" size={16} color="#64748B" />
            <Text style={styles.detailLabel}>Local:</Text>
            <Text style={styles.detailText}>
              {match.local || "Não definido"}
            </Text>
          </View>

          <View style={styles.detailItem}>
            <Ionicons name="time" size={16} color="#64748B" />
            <Text style={styles.detailLabel}>Horário:</Text>
            <Text style={styles.detailText}>
              {match.horario || "Não definido"}
            </Text>
          </View>

          <View style={styles.detailItem}>
            <Ionicons name="calendar" size={16} color="#64748B" />
            <Text style={styles.detailLabel}>Data:</Text>
            <Text style={styles.detailText}>
              {match.data || "Não definida"}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </Link>
  );
}

const styles = StyleSheet.create({
  matchItem: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  matchItemUnavailable: {
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  matchUnavailableText: {
    fontSize: 14,
    color: "#64748B",
    textAlign: "center",
    fontStyle: "italic",
  },
  matchHeader: {
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
    paddingBottom: 12,
    marginBottom: 12,
  },
  matchTeams: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0B4619",
    textAlign: "center",
  },
  matchDetails: {
    gap: 8,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: "#64748B",
    fontWeight: "500",
  },
  detailText: {
    fontSize: 14,
    color: "#475569",
    fontWeight: "500",
  },
});
