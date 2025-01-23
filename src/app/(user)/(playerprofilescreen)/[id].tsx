import React, { useState, useCallback, memo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  ListRenderItemInfo,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import CustomScreen from "@/components/CustomView";
import { useProfile } from "@/api/profiles";
import { useClubsByUserAdminId } from "@/api/club_members";
import { useSessionStore } from "@/store/useSessionStore";
import {
  useCreateInvitation,
  checkIsClubMember,
  checkPendingInvitation,
} from "@/api/club_invitation";
import { useQueryClient } from "@tanstack/react-query";
import { ProfileInviteClubItem } from "@/components/ProfileUser/ProfileInviteClubItem";
import { ProfileInviteHeader } from "@/components/ProfileUser/ProfileInviteHeader";
import { ProfileInviteModal } from "@/components/ProfileUser/ProfileInviteModal";

type ClubType = {
  club_id: string;
  id: string;
  joined_at: string;
  player_id: string;
  role: string;
  clubs: {
    name: string;
  };
};

export default function PlayerProfileScreen() {
  const [isModalVisible, setModalVisible] = useState(false);
  const [processingClubId, setProcessingClubId] = useState<string | null>(null);
  const { id } = useLocalSearchParams<{ id: string }>();
  const userId = id;
  const { data: profile } = useProfile(userId);
  const queryClient = useQueryClient();
  const { session } = useSessionStore();

  if (!session) {
    throw new Error("Sem sessão");
  }

  const adminId = session.user.id;
  const { data: clubs, isLoading, error } = useClubsByUserAdminId(adminId);
  const { mutate: createInvitation } = useCreateInvitation();

  const handleClubSelection = useCallback(
    async (selectedClubId: string) => {
      try {
        setProcessingClubId(selectedClubId);

        const [isMember, hasInvite] = await Promise.all([
          checkIsClubMember(selectedClubId, userId),
          checkPendingInvitation(selectedClubId, userId),
        ]);

        if (isMember || hasInvite) {
          Alert.alert(
            "Erro",
            isMember
              ? "O usuário já é membro deste clube"
              : "Já existe um convite pendente para este clube"
          );
          setProcessingClubId(null);
          return;
        }

        createInvitation(
          { club_id: selectedClubId, user_id: userId, invited_by: adminId },
          {
            onSuccess: () => {
              queryClient.invalidateQueries({ queryKey: ["club_invitations"] });
              setModalVisible(false);
            },
            onSettled: () => setProcessingClubId(null),
          }
        );
      } catch (error) {
        console.error("Verificação falhou:", error);
        setProcessingClubId(null);
      }
    },
    [adminId, userId, queryClient, createInvitation]
  );

  const renderClubItem = useCallback(
    ({ item }: ListRenderItemInfo<ClubType>) => (
      <ProfileInviteClubItem
        item={item}
        onPress={() => handleClubSelection(item.club_id)}
        processingClubId={processingClubId}
      />
    ),
    [handleClubSelection, processingClubId]
  );

  return (
    <CustomScreen>
      <View style={styles.header}>
        <TouchableOpacity onPress={router.back} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Perfil do Jogador</Text>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <ProfileInviteHeader
          photo={profile?.photo || ""}
          name={profile?.name}
        />

        <TouchableOpacity
          style={styles.inviteButton}
          onPress={() => setModalVisible(true)}
          disabled={!!processingClubId}
        >
          {processingClubId ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.inviteButtonText}>Convidar para o Clube</Text>
          )}
        </TouchableOpacity>
      </ScrollView>

      <ProfileInviteModal
        visible={isModalVisible}
        clubs={clubs}
        isLoading={isLoading}
        error={error}
        processingClubId={processingClubId}
        onClose={() => setModalVisible(false)}
        renderItem={renderClubItem}
      />
    </CustomScreen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  inviteButton: {
    backgroundColor: "#16A34A",
    borderRadius: 14,
    padding: 18,
    alignItems: "center",
    shadowColor: "#16A34A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  inviteButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  container: {
    padding: 16,
  },
});
