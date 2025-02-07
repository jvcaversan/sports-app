import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
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
  const queryClient = useQueryClient();

  const { data: confirmedPlayers, isLoading } = useConfirmedPlayers(matchId);
  const { data: matchData } = useMatchDetails(matchId);
  const { mutateAsync: saveLineupAsync } = useSaveLineup();
  const { mutateAsync: updateLineupAsync } = useUpdateLineup();

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

  const [team1, setTeam1] = useState<{
    starters: TeamPlayer[];
    substitutes: TeamPlayer[];
  }>({ starters: [], substitutes: [] });

  const [team2, setTeam2] = useState<{
    starters: TeamPlayer[];
    substitutes: TeamPlayer[];
  }>({ starters: [], substitutes: [] });

  const [teamsShuffled, setTeamsShuffled] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (existingLineups && confirmedPlayers && matchData) {
      const loadExistingLineups = async () => {
        const allLineupPlayers = existingLineups.flatMap((l) =>
          l.lineup_players.map((lp) => lp.player_id)
        );

        const substitutes = confirmedPlayers
          .filter((p) => !allLineupPlayers.includes(p.id))
          .map((p) => {
            const originalLineup = existingLineups.find((l) =>
              l.lineup_players.some((lp) => lp.player_id === p.id)
            );

            return {
              ...p,
              position: p.player_ratings?.[0]?.position || "Desconhecida",
              team: originalLineup?.team_name === matchData.team1 ? "A" : "B",
              membership: p.club_members?.[0]?.membership || "suplente",
              rating: p.player_ratings?.[0]?.rating || 0,
            };
          });

        const processTeam = (teamName: string) => {
          const lineup = existingLineups.find((l) => l.team_name === teamName);
          if (!lineup) return [];

          return lineup.lineup_players
            .map((lp) => {
              const player = confirmedPlayers.find(
                (p) => p.id === lp.player_id
              );
              return player
                ? {
                    ...player,
                    position: lp.position,
                    team: teamName === matchData.team1 ? "A" : "B",
                    membership: "mensalista",
                    rating: player.player_ratings?.[0]?.rating || 0,
                  }
                : null;
            })
            .filter(Boolean) as TeamPlayer[];
        };

        setTeam1({
          starters: processTeam(matchData.team1),
          substitutes: substitutes.filter((p) => p.team === "A"),
        });

        setTeam2({
          starters: processTeam(matchData.team2),
          substitutes: substitutes.filter((p) => p.team === "B"),
        });
        setTeamsShuffled(true);
      };

      loadExistingLineups();
    }
  }, [existingLineups, confirmedPlayers, matchData]);

  const shuffleTeams = () => {
    try {
      if (!confirmedPlayers?.length || !matchData) return;

      const transformedPlayers: TeamPlayer[] = confirmedPlayers.map(
        (player) => ({
          ...player,
          name: player.name
            ?.toLowerCase()
            .replace(/(^\w{1})|(\s+\w{1})/g, (letra) => letra.toUpperCase()),
          position: player.player_ratings?.[0]?.position || "Desconhecida",
          rating: player.player_ratings?.[0]?.rating || 0,
          membership:
            player.club_members?.[0]?.membership === "mensalista"
              ? "mensalista"
              : "suplente",
        })
      );

      const { teamA: shuffledA, teamB: shuffledB } = createBalancedTeams(
        transformedPlayers.filter((p) => p.membership === "mensalista"),
        transformedPlayers.filter((p) => p.membership === "suplente")
      );

      setTeam1({
        starters: shuffledA.starters.map((p) => ({ ...p, team: "A" })),
        substitutes: shuffledA.substitutes.map((p) => ({ ...p, team: "A" })),
      });

      setTeam2({
        starters: shuffledB.starters.map((p) => ({ ...p, team: "B" })),
        substitutes: shuffledB.substitutes.map((p) => ({ ...p, team: "B" })),
      });
      setTeamsShuffled(true);
    } catch (error) {
      console.error("Erro ao criar os times:", error);
      Alert.alert("Erro", "Não foi possível sortear os times");
    }
  };

  const handleMoveToSubstitutes = (playerId: string, team: "A" | "B") => {
    if (!isEditing) return;

    const [currentTeam, setTeam] =
      team === "A" ? [team1, setTeam1] : [team2, setTeam2];

    const player = currentTeam.starters.find((p) => p.id === playerId);
    if (player) {
      setTeam({
        starters: currentTeam.starters.filter((p) => p.id !== playerId),
        substitutes: [...currentTeam.substitutes, player],
      });
    }
  };

  const handleAddToStarters = (
    playerId: string,
    position: string,
    targetTeam: "A" | "B"
  ) => {
    if (!isEditing || !position) return;

    const [currentTeam, setTeam] =
      targetTeam === "A" ? [team1, setTeam1] : [team2, setTeam2];

    const player = [...team1.substitutes, ...team2.substitutes].find(
      (p) => p.id === playerId
    );

    if (!player) return;

    setTeam1((prev) => ({
      ...prev,
      substitutes: prev.substitutes.filter((p) => p.id !== playerId),
    }));
    setTeam2((prev) => ({
      ...prev,
      substitutes: prev.substitutes.filter((p) => p.id !== playerId),
    }));

    setTeam({
      starters: [...currentTeam.starters, { ...player, position }],
      substitutes: currentTeam.substitutes,
    });
  };

  const handleConfirm = async () => {
    if (!matchData || !matchId) {
      Alert.alert("Erro", "Dados da partida não encontrados");
      return;
    }

    try {
      setIsSaving(true);

      const processTeam = async (team: "A" | "B") => {
        const isTeamA = team === "A";
        const teamData = isTeamA ? team1 : team2;
        const teamName = isTeamA ? matchData.team1 : matchData.team2;

        const allPlayers = [...teamData.starters, ...teamData.substitutes];

        const existingLineup = existingLineups?.find(
          (l) => l.team_name === teamName
        );

        if (existingLineup) {
          // Remove existing lineup players first
          const { error: deleteError } = await supabase
            .from("lineup_players")
            .delete()
            .eq("lineup_id", existingLineup.id);

          if (deleteError) throw deleteError;

          await updateLineupAsync({
            lineup_id: existingLineup.id,
            team_name: teamName,
            players: allPlayers.map((p) => ({
              id: p.id,
              position: p.position,
            })),
            match_id: matchId,
          });
        } else {
          await saveLineupAsync({
            match_id: matchId,
            team_name: teamName,
            players: allPlayers.map((p) => ({
              id: p.id,
              position: p.position,
            })),
          });
        }
      };

      await Promise.all([processTeam("A"), processTeam("B")]);

      queryClient.invalidateQueries({ queryKey: ["match-lineups", matchId] });

      Alert.alert("Sucesso", "Escalações salvas com sucesso!");
    } catch (error) {
      console.error("Erro no salvamento:", error);
      Alert.alert("Erro", "Falha ao salvar as escalações");
    } finally {
      setIsSaving(false);
      setIsEditing(false);
    }
  };

  if (isLoading) {
    return <LoadingIndicator color="green" message="Carregando jogadores" />;
  }

  return (
    <View style={lineupstyles.teamContainer}>
      {teamsShuffled || existingLineups?.length ? (
        <ScrollView>
          <View style={lineupstyles.teamsContainer}>
            <LineupTeamList
              teamName={matchData?.team1 || "Time Casa"}
              players={team1.starters}
              substitutes={team1.substitutes}
              allSubstitutes={[...team1.substitutes, ...team2.substitutes]}
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
              players={team2.starters}
              substitutes={team2.substitutes}
              allSubstitutes={[...team1.substitutes, ...team2.substitutes]}
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
          disabled={(teamsShuffled && !isEditing) || !matchData}
        >
          <Text style={lineupstyles.buttonText}>Sortear</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            lineupstyles.editButton,
            isEditing && lineupstyles.confirmButtonActive,
          ]}
          onPress={isEditing ? handleConfirm : () => setIsEditing(true)}
          disabled={!teamsShuffled || isSaving || !matchData}
        >
          <Text style={lineupstyles.buttonText}>
            {isEditing ? "Confirmar" : "Editar"}
          </Text>
        </TouchableOpacity>
      </View>

      {isSaving && (
        <LoadingIndicator color="#2ecc71" message="Salvando escalações..." />
      )}
    </View>
  );
}
