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
import { MaterialIcons, AntDesign } from "@expo/vector-icons";
import { useSessionStore } from "@/store/useSessionStore";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { setSession } = useSessionStore();

  async function signInWithEmail() {
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      Alert.alert("Email ou Senha inválidos");
      setLoading(false);
      return;
    }

    setSession(data?.session);

    if (data?.session) {
      router.replace("/(user)/home");
    }

    setLoading(false);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bem-vindo de Volta!</Text>
      <Text style={styles.subtitle}>Faça login para continuar</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.textInput}
          onChangeText={setEmail}
          value={email}
          placeholder="email@exemplo.com"
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
        onPress={signInWithEmail}
      >
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>

      <View style={styles.socialButtonsContainer}>
        <TouchableOpacity
          style={styles.socialButton}
          onPress={() => {
            const { session } = useSessionStore.getState();
            if (session) {
              router.navigate("/(user)/home");
            } else {
              router.replace("/(auth)/signin");
            }
          }}
        >
          <AntDesign name="google" size={24} color="#DB4437" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.socialButton}
          onPress={() => {
            const { session } = useSessionStore.getState();
            if (session) {
              router.navigate("/(user)/home");
            } else {
              router.replace("/(auth)/signin");
            }
          }}
        >
          <MaterialIcons name="facebook" size={24} color="#4267B2" />
        </TouchableOpacity>
      </View>

      <View style={styles.footerContainer}>
        <Text style={styles.footerText}>Não possui uma conta? </Text>
        <TouchableOpacity onPress={() => router.navigate("/(auth)/signup")}>
          <Text style={styles.linkText}>Cadastre-se</Text>
        </TouchableOpacity>
      </View>
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
  socialButtonsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 20,
  },
  socialButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  footerContainer: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  footerText: {
    color: "#757575",
    fontSize: 16,
  },
  linkText: {
    color: "#2E7D32",
    fontSize: 16,
    fontWeight: "600",
  },
});
