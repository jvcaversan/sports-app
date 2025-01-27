import {
  FlatList,
  View,
  Text,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import { useIsClubAdmin, useSendMensalistasInvites } from "@/api/club_members";
import { useSessionStore } from "@/store/useSessionStore";
import {
  useMatchInvitations,
  useSendSuplentesInvites,
} from "@/api/createMatch";
import { Ionicons } from "@expo/vector-icons";
import LoadingIndicator from "../ActivityIndicator";
import { InviteItem } from "./inviteitem";

const STATUS_ORDER = ["pending", "accepted", "rejected"];

type SectionData = {
  status: string;
  title: string;
  data: any[];
  color: string;
};

export default function ConvocacaoTab({
  matchId,
  clubId,
}: {
  matchId: string;
  clubId: string;
}) {
  const { session } = useSessionStore();
  const { data: isAdmin } = useIsClubAdmin(clubId, session?.user.id || "");
  const { data: invitations, isLoading } = useMatchInvitations(matchId);

  const { mutate: inviteMensalistas, isPending: mensalistasLoading } =
    useSendMensalistasInvites();
  const { mutate: inviteSuplentes, isPending: suplentesLoading } =
    useSendSuplentesInvites();

  const transformData = (): SectionData[] => {
    if (!invitations) return [];

    return STATUS_ORDER.map((status) => {
      const filteredInvites = invitations.filter(
        (invite) => invite.status === status
      );
      if (filteredInvites.length === 0) return null;

      return {
        status,
        title: getStatusTitle(status),
        data: filteredInvites,
        color: getStatusColor(status),
      };
    }).filter(Boolean) as SectionData[];
  };

  const getStatusTitle = (status: string): string => {
    switch (status) {
      case "pending":
        return "Pendentes";
      case "accepted":
        return "Confirmados";
      case "rejected":
        return "Recusados";
      default:
        return "";
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case "pending":
        return "#F2994A";
      case "accepted":
        return "#27AE60";
      case "rejected":
        return "#EB5757";
      default:
        return "#828282";
    }
  };

  const handleResendInvite = (inviteId: string) => {
    Alert.alert("Reenviar convite", "Funcionalidade em desenvolvimento");
  };

  const ListHeader = (
    <View style={styles.buttonGroup}>
      <TouchableOpacity
        style={[styles.button, mensalistasLoading && styles.disabledButton]}
        onPress={() => inviteMensalistas({ matchId, clubId })}
        disabled={mensalistasLoading}
      >
        {mensalistasLoading ? (
          <LoadingIndicator message="Carregando" color="green" />
        ) : (
          <>
            <Ionicons name="people-outline" size={20} color="white" />
            <Text style={styles.buttonText}>Convidar Mensalistas</Text>
          </>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, suplentesLoading && styles.disabledButton]}
        onPress={() => inviteSuplentes({ matchId, clubId })}
        disabled={suplentesLoading}
      >
        {suplentesLoading ? (
          <LoadingIndicator message="Carregando" color="green" />
        ) : (
          <>
            <Ionicons name="person-add-outline" size={20} color="white" />
            <Text style={styles.buttonText}>Convidar Suplentes</Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );

  if (!isAdmin) {
    return (
      <View style={styles.adminContainer}>
        <Ionicons name="alert-circle-outline" size={48} color="#828282" />
        <Text style={styles.accessText}>Acesso restrito a administradores</Text>
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <LoadingIndicator message="Carregando" color="green" />
      </View>
    );
  }

  return (
    <FlatList
      data={transformData()}
      keyExtractor={(item) => item.status}
      ListHeaderComponent={ListHeader}
      contentContainerStyle={styles.container}
      renderItem={({ item }) => (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: item.color }]}>
              {item.title}
            </Text>
            <Text style={styles.countBadge}>{item.data.length}</Text>
          </View>

          <FlatList
            data={item.data}
            keyExtractor={(invite) => invite.id}
            renderItem={({ item: invite }) => (
              <InviteItem
                invite={invite}
                onResend={() => handleResendInvite(invite.id)}
              />
            )}
            scrollEnabled={false}
          />
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 32,
  },
  adminContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  accessText: {
    textAlign: "center",
    marginTop: 16,
    color: "#828282",
    fontSize: 16,
  },
  buttonGroup: {
    gap: 12,
    marginBottom: 32,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#2F80ED",
    padding: 16,
    borderRadius: 8,
  },
  disabledButton: {
    backgroundColor: "#BDBDBD",
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  countBadge: {
    backgroundColor: "#F0F0F0",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 14,
    fontWeight: "500",
  },
});
