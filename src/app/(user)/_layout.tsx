import { Stack } from "expo-router";

export default function UserScreen() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />

      <Stack.Screen name="(public-profile)/[userId]" />
    </Stack>
  );
}
