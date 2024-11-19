import { useSessionStore } from "@/store/useSessionStore";
import { router, Stack } from "expo-router";
import { useEffect } from "react";

export default function UserLayout() {
  const { session } = useSessionStore();

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!session) {
        router.replace("/(auth)/signin");
      }
    }, 0); // Aguarda o próximo ciclo de renderização

    return () => clearTimeout(timeout);
  }, [session]);
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
