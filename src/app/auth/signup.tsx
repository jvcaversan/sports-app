import { View, StyleSheet } from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { AuthHeader } from "../../components/auth/AuthHeader";
import { AuthFooter } from "../../components/auth/AuthFooter";

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async () => {
    setIsLoading(true);
    try {
      // Aqui você adicionará sua lógica de cadastro posteriormente
      await router.replace("/(app)/home");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <AuthHeader
        title="Criar Conta"
        subtitle="Preencha seus dados para começar"
      />

      <View style={styles.form}>
        <Input
          icon="person"
          value={name}
          onChangeText={setName}
          placeholder="Nome completo"
        />

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

        <Button
          title="Cadastrar"
          onPress={handleSignUp}
          isLoading={isLoading}
        />

        <AuthFooter
          question="Já tem uma conta?"
          linkText="Faça login"
          linkHref="/auth/signin"
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
