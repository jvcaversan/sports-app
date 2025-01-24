import React from "react";
import { StyleSheet, Alert } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import CustomScreen from "@/components/CustomView";
import { ErrorState } from "@/components/Erros/ErroState";
import { useMemberProfile } from "@/hooks/Member/useMemberProfile";
import { useMemberMutations } from "@/hooks/Member/useMemberMutations";
import { LoadingState } from "@/components/Erros/LoadingState";
import { ProfileHeader } from "@/components/MemberProfile/ProfileHeader";
import { AdminActions } from "@/components/MemberProfile/AdminActions";

export default function MemberProfileScreen() {
  const { memberId: playerId, clubId } = useLocalSearchParams<{
    memberId: string;
    clubId: string;
  }>();

  if (!clubId || !playerId) {
    return <ErrorState message="Parâmetros inválidos" />;
  }

  const { member, isLoading, error, isAdmin, currentUserId } = useMemberProfile(
    clubId,
    playerId
  );

  const { updateRole, removeMember } = useMemberMutations(clubId, playerId);

  const handleUpdateRole = (newRole: string) => {
    Alert.alert("Confirmar", `Deseja alterar o cargo para ${newRole}?`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Confirmar",
        onPress: () =>
          updateRole.mutate(newRole, {
            onSuccess: () => {
              Alert.alert("Sucesso", "Cargo atualizado com sucesso", [
                {
                  text: "OK",
                  onPress: () => router.back(),
                },
              ]);
            },
          }),
      },
    ]);
  };

  const handleRemoveMember = () => {
    Alert.alert("Confirmar", "Tem certeza que deseja remover este membro?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Remover",
        onPress: () =>
          removeMember.mutate(undefined, {
            onSuccess: () => {
              Alert.alert("Sucesso", "Membro removido do clube", [
                {
                  text: "OK",
                  onPress: () => router.back(),
                },
              ]);
            },
          }),
      },
    ]);
  };

  if (isLoading)
    return <LoadingState message="Carregando..." color="#0B4619" />;
  if (error) return <ErrorState message={error.message} />;
  if (!member?.profiles) return <ErrorState message="Perfil não encontrado" />;

  return (
    <CustomScreen>
      <ProfileHeader
        name={member.profiles.name}
        photo={member.profiles.photo}
        role={member.role}
        joinedAt={member.joined_at}
      />

      {isAdmin && currentUserId !== playerId && (
        <AdminActions
          currentRole={member.role}
          onUpdateRole={handleUpdateRole}
          onRemoveMember={handleRemoveMember}
        />
      )}
    </CustomScreen>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#E9ECEF",
  },
  backButton: {
    marginRight: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#2F4858",
    fontFamily: "Inter-SemiBold",
  },
  content: {
    flex: 1,
    padding: 24,
  },
});
