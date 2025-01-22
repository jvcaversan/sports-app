import React, { useState } from "react";
import {
  Alert,
  StyleSheet,
  View,
  TextInput,
  Text,
  TouchableOpacity,
} from "react-native";
import { supabase } from "@/database/supabase";
import { router } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { useSessionStore } from "@/store/useSessionStore";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { initializeSession } = useSessionStore();

  async function signUpWithEmail() {
    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      Alert.alert("Erro", error.message);
      setLoading(false);
      return;
    }

    Alert.alert("Conta criada com sucesso!", "", [
      {
        text: "OK",
        onPress: async () => {
          await initializeSession();
          router.push("/perfil");
        },
      },
    ]);

    setLoading(false);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crie sua Conta</Text>
      <Text style={styles.subtitle}>
        Junte-se ao jogo e mostre seu talento!
      </Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.textInput}
          onChangeText={setEmail}
          value={email}
          placeholder="email@address.com"
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor="#A3A3A3"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Senha</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={[styles.textInput, styles.passwordInput]}
            onChangeText={setPassword}
            value={password}
            secureTextEntry={!showPassword}
            placeholder="Digite sua senha"
            autoCapitalize="none"
            placeholderTextColor="#A3A3A3"
          />
          <TouchableOpacity
            style={styles.visibilityButton}
            onPress={() => setShowPassword(!showPassword)}
          >
            <MaterialIcons
              name={showPassword ? "visibility-off" : "visibility"}
              size={24}
              color="#A3A3A3"
            />
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        disabled={loading}
        onPress={signUpWithEmail}
      >
        <Text style={styles.buttonText}>Cadastrar</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.linkButton}
        onPress={() => router.navigate("/(auth)/signin")}
      >
        <View style={{ flexDirection: "row" }}>
          <Text style={styles.navigationText}>Já tem conta? </Text>
          <Text style={styles.linkText}>Faça Login </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2E7D32",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#757575",
    textAlign: "center",
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: "#2E7D32",
    marginBottom: 8,
  },
  textInput: {
    height: 50,
    borderWidth: 1,
    borderColor: "#A3A3A3",
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    color: "#333",
    backgroundColor: "#F9F9F9",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  passwordInput: {
    flex: 1,
  },
  visibilityButton: {
    position: "absolute",
    right: 15,
    padding: 10,
  },
  button: {
    backgroundColor: "#2E7D32",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonDisabled: {
    backgroundColor: "#81C784",
  },
  buttonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  linkButton: {
    marginTop: 20,
    alignItems: "center",
  },
  linkText: {
    color: "#2E7D32",
    fontSize: 16,
    fontWeight: "600",
  },
  navigationText: {
    color: "#757575",
    fontSize: 16,
    fontWeight: "600",
  },
});
