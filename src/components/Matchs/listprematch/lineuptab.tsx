import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useLocalSearchParams } from "expo-router";

import {
  useConfirmedPlayers,
  useMatchDetails,
} from "./hooks/useLineupMutation";
import LineupStyles from "./styles/lineupstyles";

import { TeamPlayer } from "./types";
import { LineupTeamList } from "./components/LineupTeamList";
import { createBalancedTeams } from "./utils/teamUtils";
import LoadingIndicator from "@/components/ActivityIndicator";

export default function LineUpTab() {
  const { id } = useLocalSearchParams();
  const matchId = Array.isArray(id) ? id[0] : id;

  const { data: confirmedPlayers, isLoading } = useConfirmedPlayers(matchId);
  const { data: matchData } = useMatchDetails(matchId);

  const [teamA, setTeamA] = useState<TeamPlayer[]>([]);
  const [teamB, setTeamB] = useState<TeamPlayer[]>([]);
  const [substitutesA, setSubstitutesA] = useState<TeamPlayer[]>([]);
  const [substitutesB, setSubstitutesB] = useState<TeamPlayer[]>([]);
  const [teamsShuffled, setTeamsShuffled] = useState(false);

  const shuffleTeams = () => {
    try {
      if (!confirmedPlayers?.length) return;

      const transformedPlayers: TeamPlayer[] = confirmedPlayers.map(
        (player) => ({
          ...player,
          position: player.player_ratings?.[0]?.position || "Desconhecida",
          rating: player.player_ratings?.[0]?.rating || 0,
          membership:
            player.club_members?.[0]?.membership === "mensalista"
              ? "mensalista"
              : "suplente",
        })
      );

      const starters = transformedPlayers.filter(
        (player) => player.membership === "mensalista"
      );

      const substitutes = transformedPlayers.filter(
        (player) => player.membership === "suplente"
      );

      const {
        teamA: shuffledA,
        teamB: shuffledB,
        substitutes: allSubstitutes,
      } = createBalancedTeams(starters, substitutes);

      // Novo método de distribuição dos suplentes
      const shuffledSubs = [...allSubstitutes].sort(() => Math.random() - 0.5);
      const subsA: TeamPlayer[] = [];
      const subsB: TeamPlayer[] = [];
      let totalA = 0,
        totalB = 0;

      shuffledSubs.forEach((player) => {
        if (totalA <= totalB) {
          subsA.push(player);
          totalA += player.rating;
        } else {
          subsB.push(player);
          totalB += player.rating;
        }
      });

      setTeamA(shuffledA);
      setTeamB(shuffledB);
      setSubstitutesA(subsA);
      setSubstitutesB(subsB);
      setTeamsShuffled(true);
    } catch (error) {
      console.error("Erro ao criar os times:", error);
    }
  };

  if (isLoading) {
    return <LoadingIndicator color="green" message="Carregando jogadores" />;
  }

  return (
    <View style={LineupStyles.teamContainer}>
      {teamsShuffled ? (
        <ScrollView>
          <View style={LineupStyles.teamsContainer}>
            <LineupTeamList
              teamName={matchData?.team1 || "Time Casa"}
              players={teamA}
              substitutes={substitutesA}
              teamColor="#e74c3c"
            />
            <LineupTeamList
              teamName={matchData?.team2 || "Time Visitante"}
              players={teamB}
              substitutes={substitutesB}
              teamColor="#2ecc71"
            />
          </View>
        </ScrollView>
      ) : (
        <View style={LineupStyles.emptyState}>
          <Text style={LineupStyles.emptyText}>
            Times ainda não foram sorteados. Pressione "Sortear" para gerar os
            times.
          </Text>
        </View>
      )}

      <View style={LineupStyles.buttonsContainer}>
        <TouchableOpacity
          style={LineupStyles.actionButton}
          onPress={shuffleTeams}
        >
          <Text style={LineupStyles.buttonText}>Sortear</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={LineupStyles.editButton}
          onPress={() => console.log("Edit pressed")}
        >
          <Text style={LineupStyles.buttonText}>Editar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
