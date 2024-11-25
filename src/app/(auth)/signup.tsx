import React, { useState } from "react";
import { Alert, StyleSheet, View, AppState } from "react-native";
import { Button, Input } from "@rneui/themed";
import { supabase } from "@/database/supabase";
import { router } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { useSessionStore } from "@/store/useSessionStore";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { session, initializeSession } = useSessionStore();

  async function signUpWithEmail() {
    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      Alert.alert(error.message);
      setLoading(false);
      return;
    }

    Alert.alert("Conta criada com sucesso!", "", [
      {
        text: "OK",
        onPress: async () => {
          await initializeSession(); // Inicializa a sessão
          router.push("/perfil");
        },
      },
    ]);

    setLoading(false);
  }

  return (
    <View style={styles.container}>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Input
          label="Email"
          leftIcon={{ type: "font-awesome", name: "envelope" }}
          onChangeText={(text) => setEmail(text)}
          value={email}
          placeholder="email@address.com"
          autoCapitalize={"none"}
        />
      </View>
      <View style={styles.verticallySpaced}>
        <Input
          label="Password"
          leftIcon={{ type: "font-awesome", name: "lock" }}
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
          placeholder="Password"
          autoCapitalize={"none"}
        />
      </View>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Button
          title="Sign Up"
          disabled={loading}
          onPress={() => signUpWithEmail()}
        />
      </View>
      <View style={styles.verticallySpaced}>
        <Button
          title="Sign In"
          disabled={loading}
          onPress={() => router.navigate("/(auth)/signin")}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    padding: 12,
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: "stretch",
  },
  mt20: {
    marginTop: 20,
  },
});
