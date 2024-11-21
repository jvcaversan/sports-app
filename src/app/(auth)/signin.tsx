import React, { useState } from "react";
import { Alert, StyleSheet, View, Text, TouchableOpacity } from "react-native";

import { Input } from "@rneui/themed";
import { supabase } from "@/database/supabase";
import { router } from "expo-router";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { Button } from "@/components/Button";
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

    // Atualizando o estado da sessão
    setSession(data?.session); // Supondo que você tenha uma store de Zustand ou contexto

    // Redireciona para a home após o login bem-sucedido
    if (data?.session) {
      router.push("/(user)/home"); // Isso vai navegar diretamente para a página de home
    }

    setLoading(false);
  }

  return (
    <View style={styles.container}>
      <View>
        <Input
          label="Email"
          leftIcon={{ type: "material-icons", name: "email" }}
          onChangeText={(text) => setEmail(text)}
          value={email}
          placeholder="email@exemplo.com"
          autoCapitalize={"none"}
        />
      </View>
      <View>
        <Input
          label="Senha"
          leftIcon={{ type: "material-icons", name: "lock" }}
          rightIcon={
            <MaterialIcons
              name={showPassword ? "visibility" : "visibility-off"}
              onPress={() => setShowPassword(!showPassword)}
              size={24}
            />
          }
          onChangeText={(text) => setPassword(text)}
          value={password}
          secureTextEntry={!showPassword}
          placeholder="Senha"
          autoCapitalize={"none"}
        />
      </View>
      <View>
        <Button
          title="Entrar"
          variant="primary"
          disabled={loading}
          isLoading={loading}
          onPress={() => signInWithEmail()}
        />
      </View>

      <View style={styles.socialButtonsContainer}>
        <TouchableOpacity
          style={styles.socialButton}
          onPress={() => {
            router.replace("/(user)/perfil");
          }}
        >
          <AntDesign name="google" size={49} color="#DB4437" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.socialButton}
          onPress={() => {
            /* lógica de conexão com Facebook */
          }}
        >
          <MaterialIcons name="facebook" size={52} color="#4267B2" />
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
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#F5F5F5",
  },
  inputContainer: {
    marginBottom: 20,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    padding: 15,
  },
  button: {
    borderRadius: 24,
    marginVertical: 15,
    paddingVertical: 12,
  },
  footerContainer: {
    marginTop: 30,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  footerText: {
    color: "#666",
    marginRight: 5,
  },
  linkText: {
    color: "#007BFF",
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
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
});
