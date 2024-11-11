import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Link, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Button } from "@/components/Button";

interface SignUpFormData {
  name: string;
  email: string;
  password: string;
}

export default function SignUp() {
  const [formData, setFormData] = useState<SignUpFormData>({
    name: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSignUp() {
    setIsLoading(true);
    try {
      // Implement sign up logic here
      console.log("Sign up:", formData);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      router.replace("/(user)/(tabs)/home");
    } catch (error) {
      console.error("Sign up error:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.content}>
        <Text style={styles.title}>Criar Conta</Text>

        {/* Name Input */}
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <Ionicons name="person-outline" size={24} color="#666" />
            <TextInput
              style={styles.input}
              placeholder="Nome"
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
              placeholderTextColor="#666"
            />
          </View>
        </View>

        {/* Email Input */}
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <Ionicons name="mail-outline" size={24} color="#666" />
            <TextInput
              style={styles.input}
              placeholder="E-mail"
              keyboardType="email-address"
              autoCapitalize="none"
              value={formData.email}
              onChangeText={(text) => setFormData({ ...formData, email: text })}
              placeholderTextColor="#666"
            />
          </View>
        </View>

        {/* Password Input */}
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <Ionicons name="lock-closed-outline" size={24} color="#666" />
            <TextInput
              style={styles.input}
              placeholder="Senha"
              secureTextEntry={!showPassword}
              value={formData.password}
              onChangeText={(text) =>
                setFormData({ ...formData, password: text })
              }
              placeholderTextColor="#666"
            />
            <Pressable onPress={() => setShowPassword(!showPassword)}>
              <Ionicons
                name={showPassword ? "eye-outline" : "eye-off-outline"}
                size={24}
                color="#666"
              />
            </Pressable>
          </View>
        </View>

        {/* Sign Up Button */}
        <Button
          title="Criar Conta"
          onPress={handleSignUp}
          isLoading={isLoading}
        />

        {/* Sign In Link */}
        <View style={styles.signInContainer}>
          <Text style={styles.signInText}>Já possui uma conta? </Text>
          <Link href="/signin" asChild>
            <Pressable>
              <Text style={styles.signInLink}>Entrar</Text>
            </Pressable>
          </Link>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 32,
    color: "#000",
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "#f5f5f5",
  },
  input: {
    flex: 1,
    marginLeft: 8,
    fontSize: 18,
    color: "#000",
  },
  signInContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
  },
  signInText: {
    color: "#666",
    marginRight: 8,
  },
  signInLink: {
    color: "#007bff",
    fontWeight: "bold",
  },
});
