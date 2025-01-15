import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useCreateMatch } from "@/api/createMatch";
import { useSessionStore } from "@/store/useSessionStore";

const CreateClubScreen = ({ id }: { id: string }) => {
  const [team1Name, setTeam1Name] = useState("");
  const [team2Name, setTeam2Name] = useState("");
  const [local, setLocal] = useState("");
  const [horario, setHorario] = useState("");
  const [dia, setDia] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { mutate: createMatch, error } = useCreateMatch();
  const { session } = useSessionStore();

  const { clubId } = useLocalSearchParams();

  const onCreate = async () => {
    setIsSubmitting(true);

    if (!session) {
      console.error("Usuário não autenticado:");
      setIsSubmitting(false);
      return;
    }

    const userId = session.user.id;

    createMatch(
      {
        time1: team1Name,
        time2: team2Name,
        local,
        horario,
        data: dia,
        userId,
        clubId,
      },
      {
        onSuccess: async (newMatch) => {
          console.log("Partida criada com sucesso:", newMatch);
          router.replace(`/(user)/clubs/(listTeams)/(partidas)/${newMatch.id}`);
        },
        onError: (err) => {
          console.error("Erro ao criar partida:", err.message);
        },
      }
    );

    setIsSubmitting(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Criação de Partida</Text>
      <TextInput
        style={styles.input}
        placeholder="Time1"
        value={team1Name}
        onChangeText={setTeam1Name}
        editable={!isSubmitting}
      />
      <TextInput
        style={styles.input}
        placeholder="Time2"
        value={team2Name}
        onChangeText={setTeam2Name}
        editable={!isSubmitting}
      />
      <TextInput
        style={styles.input}
        placeholder="Local"
        value={local}
        onChangeText={setLocal}
        editable={!isSubmitting}
      />
      <TextInput
        style={styles.input}
        placeholder="Horario"
        value={horario}
        onChangeText={setHorario}
        editable={!isSubmitting}
      />
      <TextInput
        style={styles.input}
        placeholder="Data"
        value={dia}
        onChangeText={setDia}
        editable={!isSubmitting}
      />
      <TouchableOpacity
        style={[styles.button, isSubmitting && styles.buttonDisabled]}
        onPress={onCreate}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Criar Partida</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default CreateClubScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f7f7f7", // Fundo claro
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  input: {
    width: "90%",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 16,
    fontSize: 16,
  },
  button: {
    width: "90%",
    backgroundColor: "#007BFF", // Azul
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});
