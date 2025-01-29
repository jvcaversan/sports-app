import { Controller } from "react-hook-form";
import { useCreateMatchHandler } from "@/hooks/Matchs/CreateMatch";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from "react-native";

export default function CreateClubScreen() {
  const { form, onSubmit, isSubmitting } = useCreateMatchHandler();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = form;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Criação de Partida</Text>

        <Controller
          control={control}
          name="team1Name"
          render={({ field: { onChange, onBlur, value } }) => (
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Time 1"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                editable={!isSubmitting}
              />
              {errors.team1Name && (
                <Text style={styles.errorText}>{errors.team1Name.message}</Text>
              )}
            </View>
          )}
        />

        <Controller
          control={control}
          name="team2Name"
          render={({ field: { onChange, onBlur, value } }) => (
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Time 2"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                editable={!isSubmitting}
              />
              {errors.team2Name && (
                <Text style={styles.errorText}>{errors.team2Name.message}</Text>
              )}
            </View>
          )}
        />

        <Controller
          control={control}
          name="local"
          render={({ field: { onChange, onBlur, value } }) => (
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Local"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                editable={!isSubmitting}
              />
              {errors.local && (
                <Text style={styles.errorText}>{errors.local.message}</Text>
              )}
            </View>
          )}
        />

        <Controller
          control={control}
          name="horario"
          render={({ field: { onChange, onBlur, value } }) => (
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Horário"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                editable={!isSubmitting}
              />
              {errors.horario && (
                <Text style={styles.errorText}>{errors.horario.message}</Text>
              )}
            </View>
          )}
        />

        <Controller
          control={control}
          name="dia"
          render={({ field: { onChange, onBlur, value } }) => (
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Data"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                editable={!isSubmitting}
              />
              {errors.dia && (
                <Text style={styles.errorText}>{errors.dia.message}</Text>
              )}
            </View>
          )}
        />

        <TouchableOpacity
          style={[styles.button, isSubmitting && styles.buttonDisabled]}
          onPress={handleSubmit(onSubmit)}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Criar Partida</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f7f7",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 16,
    paddingTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
    marginTop: Platform.OS === "ios" ? 20 : 0,
  },
  inputContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 8,
  },
  input: {
    width: "90%",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    fontSize: 16,
  },
  button: {
    width: "90%",
    backgroundColor: "#007BFF",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  errorText: {
    color: "#dc2626",
    fontSize: 12,
    width: "90%",
    marginBottom: 12,
    marginTop: 4,
    fontStyle: "italic",
    fontWeight: "500",
    paddingHorizontal: 4,
    paddingVertical: 2,
    backgroundColor: "#fee2e2",
    borderRadius: 4,
  },
});
