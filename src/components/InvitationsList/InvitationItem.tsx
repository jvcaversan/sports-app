import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type InvitationItemProps = {
  invite: {
    id: string;
    created_at: string;
    club_id: { id: string; name: string; photo: string | null }; // Tipagem esperada
    invited_by: { name: string };
    status: string;
    user_id: string;
  };
  onAccept: (inviteId: string, clubId: string) => void;
  onReject: (inviteId: string) => void;
};

const InvitationItem = ({
  invite,
  onAccept,
  onReject,
}: InvitationItemProps) => {
  return (
    <View style={styles.invitationItem}>
      {/* Informações do Clube e Quem Convidou */}
      <View style={styles.clubInfo}>
        <Image
          source={{
            uri: invite.club_id.photo || "https://via.placeholder.com/50", // Foto do clube
          }}
          style={styles.clubImage}
        />
        <View style={styles.clubText}>
          <Text style={styles.clubName}>{invite.club_id.name}</Text>
          <Text style={styles.invitedBy}>
            Convidado por: {invite.invited_by.name}
          </Text>
        </View>
      </View>

      {/* Botões de Ação */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={[styles.button, styles.acceptButton]}
          onPress={() => onAccept(invite.id, invite.club_id.id)} // Passando o ID do clube
        >
          <Ionicons name="checkmark" size={20} color="#FFF" />
          <Text style={styles.buttonText}>Aceitar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.rejectButton]}
          onPress={() => onReject(invite.id)}
        >
          <Ionicons name="close" size={20} color="#FFF" />
          <Text style={styles.buttonText}>Rejeitar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  invitationItem: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginBottom: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  clubInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  clubImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  clubText: {
    flex: 1,
  },
  clubName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  invitedBy: {
    fontSize: 14,
    color: "#666",
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    flex: 1,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  acceptButton: {
    backgroundColor: "#16A34A",
    marginRight: 8,
  },
  rejectButton: {
    backgroundColor: "#DC2626",
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    marginLeft: 8,
  },
});

export default InvitationItem;
