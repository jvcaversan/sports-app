import { useSessionStore } from "@/store/useSessionStore";
import { router, Stack } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";

export default function UserLayout() {
  const { session } = useSessionStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      if (!session) {
        router.replace("/(auth)/signin");
      }
      setLoading(false);
    };

    checkSession();
  }, [session]);

  // Mostrar um indicador de carregamento ou tela de transição até verificar a sessão
  if (loading) {
    return <ActivityIndicator />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="(times)" options={{ headerShown: false }} />
    </Stack>
  );
}
