import React, { useState, useCallback, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useConfirmedPlayers, usePlayerRatings } from "@/api/club_members";
import { MaterialIcons } from "@expo/vector-icons";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/database/supabase";
import PositionSelectionModal from "./components/PlayerSelectionModal";

import {
  distributePlayers,
  calculateTeamTotal,
  sortPlayersByPosition,
} from "./utils/teamUtils";
import { POSITION_CONFIG, TeamPlayer } from "./types";
import { useSaveLineup, useUpdateLineup } from "./hooks/useLineupMutation";
import LineupStyles from "./styles/LineupStyles";
import TeamColumn from "./components/TeamColumn";

export default function LineUpTab() {
  const { id, clubId } = useLocalSearchParams();
  const matchId = Array.isArray(id) ? id[0] : id;
  const clubIdStr = Array.isArray(clubId) ? clubId[0] : clubId;

  const { data: confirmedPlayers } = useConfirmedPlayers(matchId);
  const { data: existingRatings } = usePlayerRatings(clubIdStr);
  const queryClient = useQueryClient();

  const { data: matchData } = useQuery({
    queryKey: ["match", matchId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("matches")
        .select("team1, team2")
        .eq("id", matchId)
        .single();
      return data;
    },
  });

  const [teams, setTeams] = useState<{
    teamA: TeamPlayer[];
    teamB: TeamPlayer[];
    totalA: number;
    totalB: number;
    substitutesA: TeamPlayer[];
    substitutesB: TeamPlayer[];
  } | null>(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState<string | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<"teamA" | "teamB" | null>(
    null
  );
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const { data: existingLineups } = useQuery({
    queryKey: ["match-lineups", matchId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("match_lineups")
        .select(
          `
          id, 
          team_name, 
          lineup_players (
            player_id, 
            position,
            profiles (id, name)
          )`
        )
        .eq("match_id", matchId);
      return data;
    },
  });

  const saveLineupMutation = useSaveLineup();
  const updateLineupMutation = useUpdateLineup();

  const mapPlayers = useCallback((): TeamPlayer[] => {
    if (!confirmedPlayers || !existingRatings) return [];

    return confirmedPlayers.map((player) => {
      const rating = existingRatings.find(
        (r) => r.player_id === player.player_id
      );
      return {
        id: player.player_id,
        name: player.profiles?.name
          ? player.profiles.name
              .split(" ")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ")
          : "Jogador Desconhecido",
        position: rating?.position || "MEI",
        rating: rating?.rating || 0,
      };
    });
  }, [confirmedPlayers, existingRatings]);

  const handleTeamShuffle = useCallback(() => {
    const players = mapPlayers();
    const { teamA, teamB } = distributePlayers(players);

    setTeams({
      teamA: sortPlayersByPosition(teamA),
      teamB: sortPlayersByPosition(teamB),
      totalA: calculateTeamTotal(teamA),
      totalB: calculateTeamTotal(teamB),
      substitutesA: [],
      substitutesB: [],
    });
  }, [mapPlayers]);

  const handleConfirmLineup = async () => {
    setIsSaving(true);
    try {
      if (!teams || !matchId) return;

      if (teams.teamA.length < 11 || teams.teamB.length < 11) {
        Alert.alert(
          "Times incompletos",
          "Cada time deve ter pelo menos 11 jogadores."
        );
        return;
      }

      const getLineupId = (teamName: string) =>
        existingLineups?.find((l) => l.team_name === teamName)?.id;

      const teamAPayload = {
        lineup_id: getLineupId(matchData?.team1 || "Time 1"),
        team_name: matchData?.team1 || "Time 1",
        players: teams.teamA.map((p) => ({ id: p.id, position: p.position })),
        match_id: matchId,
      };

      const teamBPayload = {
        lineup_id: getLineupId(matchData?.team2 || "Time 2"),
        team_name: matchData?.team2 || "Time 2",
        players: teams.teamB.map((p) => ({ id: p.id, position: p.position })),
        match_id: matchId,
      };

      const results = await Promise.allSettled([
        teamAPayload.lineup_id
          ? updateLineupMutation.mutateAsync({
              ...teamAPayload,
              lineup_id: teamAPayload.lineup_id!,
            })
          : saveLineupMutation.mutateAsync(teamAPayload),
        teamBPayload.lineup_id
          ? updateLineupMutation.mutateAsync({
              ...teamBPayload,
              lineup_id: teamBPayload.lineup_id!,
            })
          : saveLineupMutation.mutateAsync(teamBPayload),
      ]);

      const errors = results.filter(
        (result): result is PromiseRejectedResult =>
          result.status === "rejected"
      );

      if (errors.length > 0) throw new Error("Falha ao salvar escalações");

      await queryClient.invalidateQueries({
        queryKey: ["match-lineups", matchId],
      });

      Alert.alert("Escalação Confirmada", "Continue na aba Partida", [
        {
          text: "OK",
          onPress: () => {
            setModalVisible(false);
            setIsEditing(false);
          },
        },
      ]);
    } catch (error) {
      Alert.alert(
        "Erro ao salvar",
        `Erro: ${error instanceof Error ? error.message : "Desconhecido"}`
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemovePlayer = (player: TeamPlayer) => {
    setTeams((prev) => {
      if (!prev) return null;

      const sourceTeam = prev.teamA.includes(player) ? "teamA" : "teamB";
      const newSourceTeam = prev[sourceTeam].filter((p) => p.id !== player.id);

      const substituteKey =
        sourceTeam === "teamA" ? "substitutesA" : "substitutesB";
      const newSubstitutes = [...prev[substituteKey], player];

      return {
        ...prev,
        [sourceTeam]: newSourceTeam,
        [substituteKey]: newSubstitutes,
        totalA:
          sourceTeam === "teamA"
            ? calculateTeamTotal(newSourceTeam)
            : prev.totalA,
        totalB:
          sourceTeam === "teamB"
            ? calculateTeamTotal(newSourceTeam)
            : prev.totalB,
      };
    });
  };

  const handleAddPlayer = (player: TeamPlayer) => {
    if (!selectedTeam || !selectedPosition || !teams) return;

    const oppositeSubstitutesKey =
      selectedTeam === "teamA" ? "substitutesB" : "substitutesA";
    const isInOppositeSubstitutes = teams[oppositeSubstitutesKey].some(
      (p) => p.id === player.id
    );

    let newOppositeSubstitutes = teams[oppositeSubstitutesKey];
    if (isInOppositeSubstitutes) {
      newOppositeSubstitutes = teams[oppositeSubstitutesKey].filter(
        (p) => p.id !== player.id
      );
    }

    const currentPlayersInPosition = teams[selectedTeam].filter(
      (p) => p.position === selectedPosition
    ).length;
    const required = POSITION_CONFIG[selectedPosition].quantity;

    if (currentPlayersInPosition >= required) {
      Alert.alert("Posição lotada", "Não há vagas disponíveis nesta posição.");
      return;
    }

    const substituteKey =
      selectedTeam === "teamA" ? "substitutesA" : "substitutesB";
    const newSubstitutes = teams[substituteKey].filter(
      (p) => p.id !== player.id
    );

    const newTeam = [...teams[selectedTeam], player];
    setTeams((prev) => ({
      ...prev!,
      [selectedTeam]: newTeam,
      [substituteKey]: newSubstitutes,
      [oppositeSubstitutesKey]: newOppositeSubstitutes,
      totalA:
        selectedTeam === "teamA" ? calculateTeamTotal(newTeam) : prev!.totalA,
      totalB:
        selectedTeam === "teamB" ? calculateTeamTotal(newTeam) : prev!.totalB,
    }));

    setModalVisible(false);
  };

  useEffect(() => {
    if (existingLineups && mapPlayers) {
      const formatName = (name: string) => {
        return name
          .split(" ")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");
      };

      const loadedTeamA = existingLineups.find(
        (l) => l.team_name === matchData?.team1
      );
      const loadedTeamB = existingLineups.find(
        (l) => l.team_name === matchData?.team2
      );

      const teamAPlayers =
        loadedTeamA?.lineup_players.map((p) => ({
          id: p.player_id,
          name: p.profiles?.name
            ? formatName(p.profiles.name)
            : "Jogador Desconhecido",
          position: p.position,
          rating:
            existingRatings?.find((r) => r.player_id === p.player_id)?.rating ||
            0,
        })) || [];

      const teamBPlayers =
        loadedTeamB?.lineup_players.map((p) => ({
          id: p.player_id,
          name: p.profiles?.name
            ? formatName(p.profiles.name)
            : "Jogador Desconhecido",
          position: p.position,
          rating:
            existingRatings?.find((r) => r.player_id === p.player_id)?.rating ||
            0,
        })) || [];

      const substitutes = mapPlayers().filter(
        (player) =>
          !teamAPlayers.some((p) => p.id === player.id) &&
          !teamBPlayers.some((p) => p.id === player.id)
      );

      setTeams({
        teamA: sortPlayersByPosition(teamAPlayers),
        teamB: sortPlayersByPosition(teamBPlayers),
        totalA: calculateTeamTotal(teamAPlayers),
        totalB: calculateTeamTotal(teamBPlayers),
        substitutesA: substitutes.filter((p) =>
          teamAPlayers.some((tp) => tp.position === p.position)
        ),
        substitutesB: substitutes.filter((p) =>
          teamBPlayers.some((tp) => tp.position === p.position)
        ),
      });
    }
  }, [existingLineups, existingRatings, mapPlayers, matchData]);

  if (!confirmedPlayers?.length) {
    return (
      <View style={LineupStyles.container}>
        <MaterialIcons name="construction" size={48} color="#f1c40f" />
        <Text style={LineupStyles.title}>Escalação em desenvolvimento</Text>
        <Text style={LineupStyles.subtitle}>
          Em breve você poderá montar seu time!
        </Text>
      </View>
    );
  }

  return (
    <View style={LineupStyles.container}>
      <ScrollView contentContainerStyle={LineupStyles.scrollContainer}>
        <View style={LineupStyles.teamsContainer}>
          {teams && (
            <>
              <TeamColumn
                team={teams.teamA}
                total={teams.totalA}
                title={matchData?.team1 || "Time 1"}
                teamColor="#2ecc71"
                onRemovePlayer={handleRemovePlayer}
                teamType="teamA"
                onSlotPress={(position) => {
                  setSelectedPosition(position);
                  setSelectedTeam("teamA");
                  setModalVisible(true);
                }}
                substitutes={teams.substitutesA}
                isEditing={isEditing}
              />
              <View style={LineupStyles.separator} />
              <TeamColumn
                team={teams.teamB}
                total={teams.totalB}
                title={matchData?.team2 || "Time 2"}
                teamColor="#2D3436"
                onRemovePlayer={handleRemovePlayer}
                teamType="teamB"
                onSlotPress={(position) => {
                  setSelectedPosition(position);
                  setSelectedTeam("teamB");
                  setModalVisible(true);
                }}
                substitutes={teams.substitutesB}
                isEditing={isEditing}
              />
            </>
          )}
        </View>
      </ScrollView>

      <View style={LineupStyles.buttonsContainer}>
        <TouchableOpacity
          style={[
            LineupStyles.actionButton,
            LineupStyles.shuffleButton,
            !isEditing && { opacity: 0.5 },
          ]}
          onPress={handleTeamShuffle}
          disabled={!isEditing}
        >
          <Text style={LineupStyles.buttonText}>Sortear Times</Text>
        </TouchableOpacity>

        {!isEditing && (
          <TouchableOpacity
            style={[LineupStyles.actionButton, LineupStyles.editButton]}
            onPress={() => setIsEditing(true)}
          >
            <Text style={LineupStyles.buttonText}>Editar</Text>
          </TouchableOpacity>
        )}

        {isEditing && (
          <TouchableOpacity
            style={[LineupStyles.actionButton, LineupStyles.confirmButton]}
            onPress={handleConfirmLineup}
            disabled={isSaving}
          >
            <Text style={LineupStyles.buttonText}>
              {isSaving ? "Salvando..." : "Confirmar"}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <PositionSelectionModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        selectedPosition={selectedPosition}
        players={mapPlayers()}
        teams={teams}
        matchData={matchData}
        onSelectPlayer={handleAddPlayer}
      />
    </View>
  );
}
