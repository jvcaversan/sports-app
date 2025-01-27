import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type InvitationItemProps = {
  invite: {
    id: string;
    created_at: string;
    club_id: { id: string; club_name: string; photo: string | null };
    invited_by: { name: string };
    status: string;
    user_id: string;
  };
  onAccept: (inviteId: string, clubId: string) => void;
  onReject: (inviteId: string) => void;
  isProcessing: boolean;
};

const InvitationItem = ({
  invite,
  onAccept,
  onReject,
  isProcessing,
}: InvitationItemProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{
            uri: invite.club_id.photo || "https://via.placeholder.com/50",
          }}
          style={styles.clubImage}
        />
        <Text style={styles.clubName}>{invite.club_id.club_name}</Text>
      </View>

      <View style={styles.body}>
        <View style={styles.detailItem}>
          <Ionicons name="person-outline" size={18} color="#4A5568" />
          <Text style={styles.detailText}>{invite.invited_by.name}</Text>
        </View>

        <View style={styles.detailItem}>
          <Ionicons name="calendar-outline" size={18} color="#4A5568" />
          <Text style={styles.detailText}>
            {new Date(invite.created_at).toLocaleDateString()}
          </Text>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.button, styles.acceptButton]}
          onPress={() => onAccept(invite.id, invite.club_id.id)}
          disabled={isProcessing}
        >
          <Ionicons name="checkmark-circle" size={20} color="#16A34A" />
          <Text style={[styles.buttonText, styles.acceptText]}>Aceitar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.rejectButton]}
          onPress={() => onReject(invite.id)}
          disabled={isProcessing}
        >
          <Ionicons name="close-circle" size={20} color="#DC2626" />
          <Text style={[styles.buttonText, styles.rejectText]}>Recusar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginBottom: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  clubImage: {
    width: 48,
    height: 48,
    borderRadius: 12,
    marginRight: 12,
    backgroundColor: "#F8FAFC",
  },
  clubName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1A202C",
    flexShrink: 1,
  },
  body: {
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    color: "#4A5568",
    marginLeft: 8,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  button: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    backgroundColor: "#FFFFFF",
  },
  acceptButton: {
    borderColor: "#16A34A",
  },
  rejectButton: {
    borderColor: "#FECACA",
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 8,
  },
  acceptText: {
    color: "#16A34A",
  },
  rejectText: {
    color: "#DC2626",
  },
});

export default InvitationItem;
