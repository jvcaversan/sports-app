import { useCreateMatchHandler } from "@/hooks/Matchs/CreateMatch";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";

const CreateClubScreen = () => {
  const {
    team1Name,
    team2Name,
    setDia,
    setHorario,
    setLocal,
    setTeam1Name,
    setTeam2Name,
    isSubmitting,
    local,
    horario,
    dia,
    onCreate,
  } = useCreateMatchHandler();

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
