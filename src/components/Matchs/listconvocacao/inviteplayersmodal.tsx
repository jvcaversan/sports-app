import { useState, useCallback } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
} from "react-native";
import { useQuery } from "@tanstack/react-query";
import { useSendPlayersInvites } from "@/api/club_members";
import LoadingIndicator from "@/components/ActivityIndicator";
import { supabase } from "@/database/supabase";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  visible: boolean;
  onClose: () => void;
  matchId: string;
  clubId: string;
  type: "mensalistas" | "suplentes";
};

type Member = {
  player_id: string;
  profiles: {
    name: string;
    photo?: string;
  } | null;
};

export const InvitePlayersModal = ({
  visible,
  onClose,
  matchId,
  clubId,
  type,
}: Props) => {
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);
  const { mutate, isPending } = useSendPlayersInvites();

  const { data: players, isLoading } = useQuery({
    queryKey: ["club_members", clubId, type],
    queryFn: async () => {
      const query = supabase
        .from("club_members")
        .select("player_id, mensalista, profiles(name, photo)")
        .eq("club_id", clubId);

      if (type === "mensalistas") {
        query.eq("mensalista", true);
      } else {
        query.eq("mensalista", false);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as Member[];
    },
  });

  const togglePlayer = useCallback((playerId: string) => {
    setSelectedPlayers((prev) =>
      prev.includes(playerId)
        ? prev.filter((id) => id !== playerId)
        : [...prev, playerId]
    );
  }, []);

  const toggleSelectAll = useCallback(() => {
    if (!players) return;

    setSelectedPlayers((prev) =>
      prev.length === players.length ? [] : players.map((m) => m.player_id)
    );
  }, [players]);

  const handleInvite = () => {
    mutate({ matchId, playerIds: selectedPlayers }, { onSuccess: onClose });
  };

  const renderItem = useCallback(
    ({ item }: { item: Member }) => (
      <TouchableOpacity
        style={[
          styles.playerItem,
          selectedPlayers.includes(item.player_id) && styles.selectedItem,
        ]}
        onPress={() => togglePlayer(item.player_id)}
      >
        <Image
          source={{
            uri: item.profiles?.photo || "https://via.placeholder.com/40",
          }}
          style={styles.avatar}
        />
        <Text style={styles.playerName}>
          {item.profiles?.name || "Jogador sem nome"}
        </Text>

        {selectedPlayers.includes(item.player_id) && (
          <Ionicons
            name="checkmark-circle"
            size={20}
            color="#4A90E2"
            style={styles.checkIcon}
          />
        )}
      </TouchableOpacity>
    ),
    [selectedPlayers]
  );

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>
              Convidar {type === "mensalistas" ? "Mensalistas" : "Suplentes"}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          {isLoading ? (
            <View style={styles.loadingContainer}>
              <LoadingIndicator />
            </View>
          ) : (
            <>
              {players && players.length > 0 && (
                <TouchableOpacity
                  style={styles.selectAllButton}
                  onPress={toggleSelectAll}
                >
                  <Text style={styles.selectAllText}>
                    {selectedPlayers.length === players.length
                      ? "Desmarcar todos"
                      : "Selecionar todos"}
                  </Text>
                </TouchableOpacity>
              )}
              <FlatList
                data={players}
                keyExtractor={(item) => item.player_id}
                renderItem={renderItem}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                  <Text style={styles.emptyText}>
                    {type === "mensalistas"
                      ? "Nenhum mensalista encontrado"
                      : "Nenhum suplente encontrado"}
                  </Text>
                }
              />

              <View style={styles.footer}>
                <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                  <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.sendButton,
                    selectedPlayers.length === 0 && styles.disabledButton,
                  ]}
                  onPress={handleInvite}
                  disabled={isPending || selectedPlayers.length === 0}
                >
                  {isPending ? (
                    <LoadingIndicator color="#FFF" />
                  ) : (
                    <Text style={styles.sendButtonText}>
                      Enviar ({selectedPlayers.length})
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: 20,
  },
  modalContainer: {
    backgroundColor: "white",
    borderRadius: 16,
    maxHeight: "80%",
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#F8F9FA",
    borderBottomWidth: 1,
    borderBottomColor: "#E9ECEF",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#212529",
  },
  loadingContainer: {
    padding: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  selectAllButton: {
    padding: 12,
    backgroundColor: "#E9ECEF",
    margin: 16,
    borderRadius: 8,
  },
  selectAllText: {
    color: "#4A90E2",
    fontWeight: "500",
    textAlign: "center",
  },
  listContent: {
    paddingHorizontal: 16,
  },
  playerItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    marginVertical: 4,
    borderRadius: 8,
    backgroundColor: "#FFF",
  },
  selectedItem: {
    backgroundColor: "#E7F5FF",
    borderWidth: 1,
    borderColor: "#4A90E2",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  playerName: {
    fontSize: 16,
    color: "#212529",
    flex: 1,
  },
  checkIcon: {
    marginLeft: "auto",
  },
  footer: {
    flexDirection: "row",
    gap: 12,
    padding: 16,
    backgroundColor: "#F8F9FA",
    borderTopWidth: 1,
    borderTopColor: "#E9ECEF",
  },
  cancelButton: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#E9ECEF",
  },
  cancelButtonText: {
    color: "#212529",
    fontWeight: "500",
    textAlign: "center",
  },
  sendButton: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    backgroundColor: "#4A90E2",
  },
  disabledButton: {
    backgroundColor: "#ADB5BD",
  },
  sendButtonText: {
    color: "#FFF",
    fontWeight: "500",
    textAlign: "center",
  },
  emptyText: {
    textAlign: "center",
    color: "#6C757D",
    padding: 20,
  },
});
