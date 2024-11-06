import { Stack } from "expo-router";

export default function UserLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="(pre-match)" options={{ headerShown: false }} />
    </Stack>
  );
}
