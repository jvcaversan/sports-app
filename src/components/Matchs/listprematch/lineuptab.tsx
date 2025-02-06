import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/database/supabase";

import {
  useConfirmedPlayers,
  useMatchDetails,
  useSaveLineup,
  useUpdateLineup,
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
  const { mutateAsync: saveLineup } = useSaveLineup();
  const { mutateAsync: updateLineup } = useUpdateLineup();

  const { data: existingLineups } = useQuery({
    queryKey: ["match-lineups", matchId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("match_lineups")
        .select(
          `
          id, 
          team_name,
          lineup_players ( player_id, position )
        `
        )
        .eq("match_id", matchId!);
      return data || [];
    },
  });

  const [teamA, setTeamA] = useState<TeamPlayer[]>([]);
  const [teamB, setTeamB] = useState<TeamPlayer[]>([]);
  const [substitutesA, setSubstitutesA] = useState<TeamPlayer[]>([]);
  const [substitutesB, setSubstitutesB] = useState<TeamPlayer[]>([]);
  const [teamsShuffled, setTeamsShuffled] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (existingLineups?.length && confirmedPlayers?.length) {
      const loadExistingLineups = async () => {
        const processTeam = (teamName: string) => {
          const lineup = existingLineups.find((l) => l.team_name === teamName);
          if (!lineup) return { starters: [], substitutes: [] };

          const players = lineup.lineup_players
            .map((lp) => {
              const player = confirmedPlayers.find(
                (p) => p.id === lp.player_id
              );
              return player
                ? {
                    ...player,
                    position: lp.position,
                    team: teamName === matchData?.team1 ? "A" : "B",
                    membership:
                      player.club_members?.[0]?.membership || "suplente",
                    rating: player.player_ratings?.[0]?.rating || 0,
                  }
                : null;
            })
            .filter(Boolean) as TeamPlayer[];

          return {
            starters: players.filter((p) => p.membership === "mensalista"),
            substitutes: players.filter((p) => p.membership === "suplente"),
          };
        };

        const teamA = processTeam(matchData?.team1 || "Time Casa");
        const teamB = processTeam(matchData?.team2 || "Time Visitante");

        setTeamA(teamA.starters);
        setTeamB(teamB.starters);
        setSubstitutesA(teamA.substitutes);
        setSubstitutesB(teamB.substitutes);
        setTeamsShuffled(true);
      };

      loadExistingLineups();
    }
  }, [existingLineups, confirmedPlayers, matchData?.team1, matchData?.team2]);

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
    if (!isEditing) return;
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
    if (!isEditing) return;
    const player = [...substitutesA, ...substitutesB].find(
      (p) => p.id === playerId
    );

    if (!player) return;

    setSubstitutesA((prev) => prev.filter((p) => p.id !== playerId));
    setSubstitutesB((prev) => prev.filter((p) => p.id !== playerId));

    if (targetTeam === "A") {
      setTeamA((prev) => [...prev, { ...player, position }]);
    } else {
      setTeamB((prev) => [...prev, { ...player, position }]);
    }
  };

  const handleEditToggle = () => {
    if (!isEditing) {
      setIsEditing(true);
    } else {
      setIsEditing(false);
    }
  };

  const handleConfirm = async () => {
    setIsSaving(true);

    try {
      const processTeam = async (team: "A" | "B") => {
        const isTeamA = team === "A";
        const teamName = isTeamA ? matchData?.team1 : matchData?.team2;
        const players = isTeamA
          ? [...teamA, ...substitutesA]
          : [...teamB, ...substitutesB];

        const existing = existingLineups?.find((l) => l.team_name === teamName);

        if (existing) {
          await updateLineup({
            lineup_id: existing.id,
            team_name: teamName || "Time",
            players: players.map((p) => ({ id: p.id, position: p.position })),
            match_id: matchId!,
          });
        } else {
          await saveLineup({
            match_id: matchId!,
            team_name: teamName || "Time",
            players,
          });
        }
      };

      await processTeam("A");
      await processTeam("B");

      setTimeout(() => {
        setIsSaving(false);
        setIsEditing(false);
        Alert.alert("Sucesso", "Escalações salvas com sucesso!");
      }, 300);
    } catch (error) {
      setIsSaving(false);
      Alert.alert("Erro", "Falha ao salvar as escalações");
      console.error("Erro no salvamento:", error);
    }
  };

  if (isLoading) {
    return <LoadingIndicator color="green" message="Carregando jogadores" />;
  }

  if (isSaving) {
    return (
      <LoadingIndicator color="#2ecc71" message="Salvando escalações..." />
    );
  }

  return (
    <View style={lineupstyles.teamContainer}>
      {teamsShuffled || existingLineups?.length ? (
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
              isEditing={isEditing}
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
              isEditing={isEditing}
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
          style={[
            lineupstyles.actionButton,
            teamsShuffled && !isEditing && lineupstyles.disabledButton,
          ]}
          onPress={shuffleTeams}
          disabled={teamsShuffled && !isEditing}
        >
          <Text style={lineupstyles.buttonText}>Sortear</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            lineupstyles.editButton,
            isEditing && lineupstyles.confirmButtonActive,
          ]}
          onPress={isEditing ? handleConfirm : handleEditToggle}
          disabled={!teamsShuffled || isSaving}
        >
          <Text style={lineupstyles.buttonText}>
            {isEditing ? "Confirmar" : "Editar"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
