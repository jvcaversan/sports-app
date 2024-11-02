import { View, StyleSheet } from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { AuthHeader } from "../../components/auth/AuthHeader";
import { AuthFooter } from "../../components/auth/AuthFooter";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      // Aqui você adicionará sua lógica de autenticação posteriormente
      await router.replace("/(app)/home");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <AuthHeader
        title="Bem-vindo de volta!"
        subtitle="Faça login para continuar"
      />

      <View style={styles.form}>
        <Input
          icon="email"
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Input
          icon="lock"
          value={password}
          onChangeText={setPassword}
          placeholder="Senha"
          secureTextEntry={!showPassword}
          showPassword={showPassword}
          onTogglePassword={() => setShowPassword(!showPassword)}
        />

        <Button title="Entrar" onPress={handleLogin} isLoading={isLoading} />

        <AuthFooter
          question="Não tem uma conta?"
          linkText="Cadastre-se"
          linkHref="/auth/signup"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  form: {
    gap: 20,
  },
});
