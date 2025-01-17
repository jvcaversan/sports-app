import { Link } from "expo-router";
import { Text } from "react-native";

import { Tables } from "@/types/supabase";

import { TouchableOpacity, StyleSheet } from "react-native";

type MatchListItemProps = {
  match: Omit<Tables<"matches">, "clubid">;
};

export default function MatchListItem({ match }: MatchListItemProps) {
  return (
    <Link href={`/(user)/(clubs)/(listTeams)/(partidas)/${match.id}`} asChild>
      <TouchableOpacity style={styles.matchItem}>
        <Text style={styles.matchId}>{match.id}</Text>
        <Text style={styles.matchTeams}>
          {match.team1} vs {match.team2}
        </Text>
        <Text style={styles.matchLocation}>{match.local}</Text>
        <Text style={styles.matchTime}>{match.horario}</Text>
        <Text style={styles.matchDate}>{match.data}</Text>
      </TouchableOpacity>
    </Link>
  );
}

const styles = StyleSheet.create({
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
});
