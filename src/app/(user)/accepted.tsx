import React, { useState } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { useSessionStore } from "@/store/useSessionStore";
import {
  acceptClubInvitation,
  InvitationsByUserLogged,
  rejectClubInvitation,
} from "@/api/club_invitation";
import FlatListWrapper from "@/components/ClubsTabs/FlatListComponent";
import InvitationItem from "@/components/InvitationsList/InvitationItem";
import { LoadingState } from "@/components/Erros/LoadingState";
import CustomView from "@/components/CustomView";

export default function InvitationsScreen() {
  const [processingInvites, setProcessingInvites] = useState<Set<string>>(
    new Set()
  );
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
    if (!session?.user.id || processingInvites.has(inviteId)) return;

    setProcessingInvites((prev) => new Set(prev.add(inviteId)));

    acceptInvite(
      {
        invitation_id: inviteId,
        club_id: clubId,
        userId: userId,
      },
      {
        onSuccess: () => {
          setProcessingInvites((prev) => {
            const next = new Set(prev);
            next.delete(inviteId);
            return next;
          });
          Alert.alert("Sucesso", "Você entrou no clube com sucesso!");
        },
        onError: (error) => {
          setProcessingInvites((prev) => {
            const next = new Set(prev);
            next.delete(inviteId);
            return next;
          });
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
    <CustomView>
      <View style={styles.container}>
        <Text style={styles.header}>Convites para o Clube</Text>

        <FlatListWrapper
          data={invitations || []}
          renderItem={({ item }) => (
            <InvitationItem
              invite={item}
              onAccept={handleAcceptInvitation}
              onReject={handleRejectInvitation}
              isProcessing={processingInvites.has(item.id)}
            />
          )}
          keyExtractor={(item) => item.id.toString()}
          emptyMessage="Você não tem convites pendentes."
        />
      </View>
    </CustomView>
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
