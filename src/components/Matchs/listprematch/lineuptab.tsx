import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useLocalSearchParams } from "expo-router";

import {
  useConfirmedPlayers,
  useMatchDetails,
} from "./hooks/useLineupMutation";

import { TeamPlayer } from "./types";
import { LineupTeamList } from "./components/LineupTeamList";
import { createBalancedTeams } from "./utils/teamUtils";
import LoadingIndicator from "@/components/ActivityIndicator";
import lineupstyles from "./styles/LineupStyles";

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
          name: player.name
            ? player.name
                .toLowerCase()
                .replace(/(^\w{1})|(\s+\w{1})/g, (letra) => letra.toUpperCase())
            : "N/D",
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

      const { teamA: shuffledA, teamB: shuffledB } = createBalancedTeams(
        starters,
        substitutes
      );

      setTeamA(shuffledA.starters.map((p) => ({ ...p, team: "A" })));
      setTeamB(shuffledB.starters.map((p) => ({ ...p, team: "B" })));
      setSubstitutesA(shuffledA.substitutes.map((p) => ({ ...p, team: "A" })));
      setSubstitutesB(shuffledB.substitutes.map((p) => ({ ...p, team: "B" })));
      setTeamsShuffled(true);
    } catch (error) {
      console.error("Erro ao criar os times:", error);
    }
  };

  const handleMoveToSubstitutes = (playerId: string, team: "A" | "B") => {
    if (team === "A") {
      const player = teamA.find((p) => p.id === playerId);
      if (player) {
        setTeamA((prev) => prev.filter((p) => p.id !== playerId));
        setSubstitutesA((prev) => [...prev, { ...player, team: "A" }]);
      }
    } else {
      const player = teamB.find((p) => p.id === playerId);
      if (player) {
        setTeamB((prev) => prev.filter((p) => p.id !== playerId));
        setSubstitutesB((prev) => [...prev, { ...player, team: "B" }]);
      }
    }
  };

  const handleAddToStarters = (
    playerId: string,
    position: string,
    targetTeam: "A" | "B"
  ) => {
    // Busca em todas as listas de suplentes
    const player = [...substitutesA, ...substitutesB].find(
      (p) => p.id === playerId
    );

    if (!player) return;

    // Remove de ambas as listas
    setSubstitutesA((prev) => prev.filter((p) => p.id !== playerId));
    setSubstitutesB((prev) => prev.filter((p) => p.id !== playerId));

    // Adiciona ao time alvo
    if (targetTeam === "A") {
      setTeamA((prev) => [...prev, { ...player, position }]);
    } else {
      setTeamB((prev) => [...prev, { ...player, position }]);
    }
  };

  if (isLoading) {
    return <LoadingIndicator color="green" message="Carregando jogadores" />;
  }

  return (
    <View style={lineupstyles.teamContainer}>
      {teamsShuffled ? (
        <ScrollView>
          <View style={lineupstyles.teamsContainer}>
            <LineupTeamList
              teamName={matchData?.team1 || "Time Casa"}
              players={teamA}
              substitutes={substitutesA}
              allSubstitutes={[...substitutesA, ...substitutesB]}
              teamColor="#e74c3c"
              onMoveToSubstitutes={(id) => handleMoveToSubstitutes(id, "A")}
              onAddToStarters={(playerId, position) =>
                handleAddToStarters(playerId, position, "A")
              }
            />
            <View style={lineupstyles.separator} />
            <LineupTeamList
              teamName={matchData?.team2 || "Time Visitante"}
              players={teamB}
              substitutes={substitutesB}
              allSubstitutes={[...substitutesA, ...substitutesB]}
              teamColor="#2ecc71"
              onMoveToSubstitutes={(id) => handleMoveToSubstitutes(id, "B")}
              onAddToStarters={(playerId, position) =>
                handleAddToStarters(playerId, position, "B")
              }
            />
          </View>
        </ScrollView>
      ) : (
        <View style={lineupstyles.emptyState}>
          <Text style={lineupstyles.emptyText}>
            Times ainda não foram sorteados. Pressione "Sortear" para gerar os
            times.
          </Text>
        </View>
      )}

      <View style={lineupstyles.buttonsContainer}>
        <TouchableOpacity
          style={lineupstyles.actionButton}
          onPress={shuffleTeams}
        >
          <Text style={lineupstyles.buttonText}>Sortear</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={lineupstyles.editButton}
          onPress={() => console.log("Edit pressed")}
        >
          <Text style={lineupstyles.buttonText}>Editar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
