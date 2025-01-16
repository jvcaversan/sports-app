import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { router } from "expo-router";
import { useCreateClub } from "@/api/clubs";
import { useSessionStore } from "@/store/useSessionStore";
import { useProfile } from "@/api/profiles";

const CreateClubScreen = () => {
  const [clubName, setClubName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { mutate: createClub } = useCreateClub();

  const { session } = useSessionStore();
  const userId = session?.user.id;

  const { data: profile } = useProfile(userId);

  const onCreate = async () => {
    setIsSubmitting(true);

    if (!session) {
      console.error("Usuário não autenticado:");
      setIsSubmitting(false);
      return;
    }

    if (!userId) {
      console.error("Usuário não encontrado");
      return;
    }

    createClub(
      { name: clubName, created_by: userId, creator_name: profile?.name },
      {
        onSuccess: async (newClub) => {
          console.log("Clube criado com sucesso:", newClub);
          router.replace(`/(user)/(clubs)/(listTeams)/${newClub.id}`);
        },
        onError: (err) => {
          console.error("Erro ao criar clube:", err.message);
        },
      }
    );

    setIsSubmitting(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Criação de Clube</Text>
      <TextInput
        style={styles.input}
        placeholder="Nome do Clube"
        value={clubName}
        onChangeText={setClubName}
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
          <Text style={styles.buttonText}>Criar Clube</Text>
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
    backgroundColor: "#f7f7f7",
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
    backgroundColor: "#007BFF",
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
