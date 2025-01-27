import { useSendMensalistasInvites } from "@/api/club_members";
import { useStaticsByMatchId } from "@/api/createMatch";
import { useState } from "react";
import {
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";

export default function PreMatchTab({
  matchId,
  clubId,
}: {
  matchId: string;
  clubId: string;
}) {
  const { data: matchs } = useStaticsByMatchId(matchId);
  const {
    mutate: createMensalistasInvites,
    isPending,
    isError,
    error,
  } = useSendMensalistasInvites();
  const match = matchs?.[0];
  const [selectedTeam, setSelectedTeam] = useState<"time1" | "time2">("time1");

  const handleInviteMensalistas = () => {
    createMensalistasInvites(
      { matchId, clubId },
      {
        onSuccess: () => {
          Alert.alert("Sucesso", "Convites enviados para os mensalistas!");
        },
        onError: (error) => {
          Alert.alert("Erro", error.message);
        },
      }
    );
  };

  return (
    <ScrollView>
      <TouchableOpacity
        style={[styles.button, isPending && styles.disabledButton]}
        onPress={handleInviteMensalistas}
        disabled={isPending}
      >
        <Text style={styles.buttonText}>
          {isPending ? "Enviando..." : "Convidar Mensalistas"}
        </Text>
      </TouchableOpacity>

      {isError && (
        <Text style={styles.errorText}>Erro ao enviar: {error?.message}</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 8,
    margin: 16,
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#B3B3B3",
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
  },
  errorText: {
    color: "red",
    padding: 16,
    textAlign: "center",
  },
});
