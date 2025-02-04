import {
  useConfirmedPlayers,
  usePositions,
  usePlayerRatings,
} from "@/api/club_members";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  Alert,
} from "react-native";
import PlayerCard from "./player_card";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/database/supabase";

export default function OrganizationTab() {
  const { id, clubId } = useLocalSearchParams();
  const matchId = Array.isArray(id) ? id[0] : id;
  const clubIdStr = Array.isArray(clubId) ? clubId[0] : clubId;
  const queryClient = useQueryClient();

  const { data: confirmedPlayers } = useConfirmedPlayers(matchId);
  const { data: positions } = usePositions();
  const { data: existingRatings } = usePlayerRatings(clubIdStr);

  const [playerData, setPlayerData] = useState<
    Record<string, { rating: string; position: string }>
  >({});

  useEffect(() => {
    if (existingRatings && confirmedPlayers && positions) {
      const initialData = confirmedPlayers.reduce((acc, player) => {
        const existingRating = existingRatings.find(
          (r) => r.player_id === player.player_id
        );

        const positionId = existingRating
          ? positions
              .find((p) => p.position_name === existingRating.position)
              ?.id.toString() || ""
          : "";

        return {
          ...acc,
          [player.player_id]: {
            rating: existingRating?.rating?.toString() || "",
            position: positionId,
          },
        };
      }, {});
      setPlayerData(initialData);
    }
  }, [existingRatings, confirmedPlayers, positions]);

  const handleDataChange = (
    playerId: string,
    field: "rating" | "position",
    value: string
  ) => {
    setPlayerData((prev) => ({
      ...prev,
      [playerId]: {
        ...prev[playerId],
        [field]: value,
      },
    }));
  };

  const saveAllMutation = useMutation({
    mutationFn: async () => {
      if (!confirmedPlayers || !positions || !clubIdStr || !playerData) {
        throw new Error("Dados incompletos para salvar");
      }

      const payload = confirmedPlayers
        .filter((player) => {
          const data = playerData[player.player_id];
          return data?.position && !isNaN(parseFloat(data.rating));
        })
        .map((player) => {
          const positionId = playerData[player.player_id]?.position;
          const positionName = positions.find(
            (p) => p.id.toString() === positionId
          )?.position_name;

          if (!positionName) {
            throw new Error(`Posição não encontrada para ID: ${positionId}`);
          }

          return {
            club_id: clubIdStr,
            player_id: player.player_id,
            rating: parseFloat(playerData[player.player_id]?.rating),
            position: positionName,
          };
        });

      if (payload.length === 0) {
        throw new Error("Nenhum dado válido para salvar");
      }

      const { error } = await supabase
        .from("player_ratings")
        .upsert(payload, { onConflict: "player_id,club_id" });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["player_ratings"] });
      queryClient.invalidateQueries({
        queryKey: ["confirmedMensalistaPlayers"],
      });
      Alert.alert("Sucesso", "Dados salvos com sucesso!");
    },
    onError: (error) => {
      Alert.alert("Erro", "Ocorreu um erro ao salvar os dados");
      console.error(error);
    },
  });

  return (
    <View style={styles.container}>
      <FlatList
        data={confirmedPlayers}
        renderItem={({ item }) => (
          <PlayerCard
            player={item}
            positions={positions || []}
            initialRating={playerData[item.player_id]?.rating || ""}
            initialPosition={playerData[item.player_id]?.position || ""}
            onDataChange={(field, value) =>
              handleDataChange(item.player_id, field, value)
            }
          />
        )}
        contentContainerStyle={styles.list}
        keyExtractor={(item) => item.player_id}
        ListEmptyComponent={
          <Text style={styles.empty}>Nenhum jogador confirmado</Text>
        }
      />

      <TouchableOpacity
        style={styles.saveButton}
        onPress={() => saveAllMutation.mutate()}
        disabled={saveAllMutation.isPending}
      >
        <Text style={styles.saveText}>
          {saveAllMutation.isPending
            ? "Salvando..."
            : "Salvar Todas as Alterações"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  list: {
    padding: 16,
    paddingBottom: 80,
  },
  empty: {
    textAlign: "center",
    color: "#666",
    marginTop: 20,
  },
  saveButton: {
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
    backgroundColor: "#2ecc71",
    padding: 16,
    borderRadius: 8,
    minWidth: "80%",
    alignItems: "center",
    elevation: 3,
  },
  saveText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});
