import { FlatList, View, Text, StyleSheet } from "react-native";
import { useIsClubAdmin } from "@/api/club_members";
import { useSessionStore } from "@/store/useSessionStore";
import { useMatchInvitations } from "@/api/createMatch";
import { Ionicons } from "@expo/vector-icons";
import LoadingIndicator from "../../ActivityIndicator";
import { InviteItem } from "./inviteitem";
import { InviteSuplentesButton } from "./invitesuplentesbutton";
import { InviteMensalistasButton } from "./invitemensalistabutton";

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

  const ListHeader = (
    <View style={styles.buttonGroup}>
      <InviteMensalistasButton matchId={matchId} clubId={clubId} />
      <View style={{ width: 12 }} />
      <InviteSuplentesButton matchId={matchId} clubId={clubId} />
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
            renderItem={({ item: invite }) => <InviteItem invite={invite} />}
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
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 32,
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
