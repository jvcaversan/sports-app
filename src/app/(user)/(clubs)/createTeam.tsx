import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";

import { useCreateClubHandler } from "@/hooks/Clubs/CreateClub";

const CreateClubScreen = () => {
  const { clubName, setClubName, isSubmitting, onCreate } =
    useCreateClubHandler();

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
        disabled={isSubmitting || !clubName.trim()}
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
