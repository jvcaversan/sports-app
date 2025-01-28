import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/database/supabase";

export default function PlayerCard({
  player,
  clubId,
  positions,
}: {
  player: any;
  clubId: string;
  positions: any[];
}) {
  const [rating, setRating] = useState("");
  const [position, setPosition] = useState("");
  const [showPositionMenu, setShowPositionMenu] = useState(false);
  const queryClient = useQueryClient();

  const { data: existingRating } = useQuery({
    queryKey: ["player_rating", player.player_id, clubId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("player_ratings")
        .select("rating, position")
        .eq("player_id", player.player_id)
        .eq("club_id", clubId)
        .single();

      return error ? null : data;
    },
  });

  useEffect(() => {
    if (existingRating) {
      setRating(existingRating.rating?.toString() || "");
      setPosition(existingRating.position?.toString() || "");
    }
  }, [existingRating]);

  const saveRating = useMutation({
    mutationFn: async () => {
      const payload = {
        club_id: clubId,
        player_id: player.player_id,
        rating: Number(rating),
        position: position,
      };

      const { error } = await supabase.from("player_ratings").upsert(payload, {
        onConflict: "player_id,club_id",
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["player_ratings"] });
    },
  });

  const getPositionName = (id: string) => {
    return (
      positions.find((p) => p.id.toString() === id)?.position_name ||
      "Selecione"
    );
  };

  return (
    <View style={styles.card}>
      <MaterialIcons name="person" size={24} color="#2ecc71" />
      <View style={styles.row}>
        <Text style={styles.name}>{player.profiles.name}</Text>

        <View style={styles.positionContainer}>
          <TouchableOpacity
            style={styles.positionButton}
            onPress={() => setShowPositionMenu(true)}
          >
            <Text style={styles.positionButtonText}>
              {getPositionName(position)}
            </Text>
            <MaterialIcons name="arrow-drop-down" size={24} color="#2c3e50" />
          </TouchableOpacity>

          <Modal
            visible={showPositionMenu}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setShowPositionMenu(false)}
          >
            <TouchableOpacity
              style={styles.modalBackdrop}
              activeOpacity={1}
              onPress={() => setShowPositionMenu(false)}
            >
              <View style={styles.modalContent}>
                <ScrollView>
                  {positions.map((pos) => (
                    <TouchableOpacity
                      key={pos.id}
                      style={styles.positionItem}
                      onPress={() => {
                        setPosition(pos.id.toString());
                        setShowPositionMenu(false);
                        saveRating.mutate();
                      }}
                    >
                      <Text style={styles.positionItemText}>
                        {pos.position_name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </TouchableOpacity>
          </Modal>
        </View>

        <TextInput
          style={[styles.input, styles.smallInput]}
          value={rating}
          keyboardType="numeric"
          placeholder="Nota"
          onChangeText={setRating}
          onBlur={() => saveRating.mutate()}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 12,
    marginVertical: 4,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 8,
  },
  name: {
    fontSize: 14,
    fontWeight: "500",
    color: "#2c3e50",
    flexShrink: 1,
    minWidth: "30%",
    marginLeft: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    fontSize: 14,
    height: 40,
    color: "#2c3e50",
  },
  smallInput: {
    width: 70,
    textAlign: "center",
  },
  positionContainer: {
    flex: 1,
    marginHorizontal: 4,
    maxWidth: 140,
  },
  positionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    height: 40,
  },
  positionButtonText: {
    color: "#2c3e50",
    fontSize: 14,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    maxHeight: "60%",
    width: "80%",
  },
  positionItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  positionItemText: {
    color: "#2c3e50",
    fontSize: 16,
  },
});
