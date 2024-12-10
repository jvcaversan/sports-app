import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { router, useRouter } from "expo-router"; // Navegação com Expo Router
import { useCreateClub } from "@/api/clubs";
import { supabase } from "@/database/supabase";

const CreateClubScreen = ({ id }: { id: string }) => {
  const [clubName, setClubName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { mutate: createClub, error } = useCreateClub();

  const onCreate = async () => {
    setIsSubmitting(true);

    // Obtém a sessão ativa
    const { data: sessionData, error: sessionError } =
      await supabase.auth.getSession();

    if (sessionError || !sessionData.session) {
      console.error(
        "Usuário não autenticado:",
        sessionError?.message || "Sessão inexistente"
      );
      setIsSubmitting(false);
      return;
    }

    // Obtém o ID do usuário logado a partir da sessão
    const userId = sessionData.session.user.id;

    createClub(
      { name: clubName, userId }, // Envia o ID do usuário junto com o nome do clube
      {
        onSuccess: async (newClub) => {
          console.log("Clube criado com sucesso:", newClub);
          router.replace(`/(user)/clubs/(listTeams)/${newClub.id}`); // Redireciona para a página do clube
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
