import { StyleSheet, View, Text, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useResendPlayerInvite } from "@/api/club_members";

type InviteItemProps = {
  invite: any;
  onResend?: () => void;
  isResending?: boolean;
};

export const InviteItem = ({
  invite,
  onResend,
  isResending,
}: InviteItemProps) => {
  const { mutate: resendInvite, isPending } = useResendPlayerInvite();

  const getStatusDetails = (status: string) => {
    switch (status) {
      case "pending":
        return { color: "#F2994A", icon: "time-outline", label: "Pendente" };
      case "accepted":
        return {
          color: "#27AE60",
          icon: "checkmark-circle-outline",
          label: "Confirmado",
        };
      case "rejected":
        return {
          color: "#EB5757",
          icon: "close-circle-outline",
          label: "Recusado",
        };
      default:
        return {
          color: "#828282",
          icon: "help-circle-outline",
          label: "Desconhecido",
        };
    }
  };

  const status = getStatusDetails(invite.status);

  const handleResend = () => {
    resendInvite(
      { matchId: invite.match_id, playerId: invite.player_id },
      {
        onSuccess: () => Alert.alert("Convite reenviado!"),
        onError: (error) => Alert.alert("Erro", error.message),
      }
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.userInfo}>
        <Ionicons name="person-circle-outline" size={24} color="#333" />
        <Text style={styles.name}>{invite.profiles?.name || "Convidado"}</Text>
      </View>

      <View style={styles.statusContainer}>
        <Ionicons name={status.icon} size={16} color={status.color} />
        <Text style={[styles.statusText, { color: status.color }]}>
          {status.label}
        </Text>
      </View>

      {(invite.status === "pending" || invite.status === "rejected") && (
        <TouchableOpacity
          style={styles.resendButton}
          onPress={handleResend}
          disabled={isResending}
        >
          {isResending ? (
            <Ionicons name="refresh-outline" size={16} color="#2F80ED" />
          ) : (
            <Ionicons name="send-outline" size={16} color="#2F80ED" />
          )}
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  userInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  name: {
    fontSize: 16,
    color: "#333",
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginHorizontal: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "500",
  },
  resendButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "#E8F3FF",
  },
});
