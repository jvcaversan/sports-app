import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
// Importando o componente de item
import { useSessionStore } from "@/store/useSessionStore";
import { InvitationsByUserLogged } from "@/api/club_invitation"; // API para buscar os convites
import FlatListWrapper from "@/components/ClubsTabs/FlatListComponent";
import InvitationItem from "@/components/InvitationsList/InvitationItem";
import { LoadingState } from "@/components/Erros/LoadingState";
// import { acceptInvitation, rejectInvitation } from "@/api/club_invitation"; // Funções para aceitar e rejeitar o convite

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

  if (isLoading) {
    <LoadingState color="green" message="Aguarde" />;
  }

  const handleAcceptInvitation = async (inviteId: string, clubId: string) => {
    // try {
    //   await acceptInvitation(inviteId, clubId);
    //   Alert.alert("Convite Aceito", "Você foi adicionado ao clube!");
    // } catch (error) {
    //   Alert.alert("Erro", "Não foi possível aceitar o convite.");
    // }
  };

  const handleRejectInvitation = async (inviteId: string) => {
    // try {
    //   await rejectInvitation(inviteId);
    //   Alert.alert("Convite Rejeitado", "Você não foi adicionado ao clube.");
    // } catch (error) {
    //   Alert.alert("Erro", "Não foi possível rejeitar o convite.");
    // }
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
