import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
// Importando o componente de item
import { useSessionStore } from "@/store/useSessionStore";
import {
  acceptClubInvitation,
  InvitationsByUserLogged,
  rejectClubInvitation,
} from "@/api/club_invitation";
import FlatListWrapper from "@/components/ClubsTabs/FlatListComponent";
import InvitationItem from "@/components/InvitationsList/InvitationItem";
import { LoadingState } from "@/components/Erros/LoadingState";

export default function InvitationsScreen() {
  const { session } = useSessionStore();

  if (!session) {
    throw new Error("no session");
  }

  const userId = session?.user.id;

  const {
    data: invitations,
    isLoading,
    error,
  } = InvitationsByUserLogged(userId);

  const { mutate: rejectInvite } = rejectClubInvitation();
  const { mutate: acceptInvite } = acceptClubInvitation();

  if (isLoading) {
    <LoadingState color="green" message="Aguarde" />;
  }

  const handleAcceptInvitation = async (inviteId: string, clubId: string) => {
    if (!session?.user.id) return;

    acceptInvite(
      {
        invitation_id: inviteId,
        club_id: clubId,
        player_id: session.user.id,
      },
      {
        onSuccess: () => {
          Alert.alert("Sucesso", "Você entrou no clube com sucesso!");
        },
        onError: (error) => {
          console.log(error);
          Alert.alert(
            "Erro",
            error.message || "Não foi possível aceitar o convite."
          );
        },
      }
    );
  };

  const handleRejectInvitation = (inviteId: string) => {
    rejectInvite(inviteId, {
      onError: (error) => {
        Alert.alert(
          "Erro",
          error.message || "Não foi possível recusar o convite."
        );
      },
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Convites para o Clube</Text>

      <FlatListWrapper
        data={invitations || []}
        renderItem={({ item }) => (
          <InvitationItem
            invite={item}
            onAccept={handleAcceptInvitation}
            onReject={handleRejectInvitation}
          />
        )}
        keyExtractor={(item) => item.id.toString()}
        emptyMessage="Você não tem convites pendentes."
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#F8FAFC",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#111",
  },
});
