import { Slot, Stack } from "expo-router";

export default function PartidasLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="[id]" />
      <Stack.Screen name="match-status" />
    </Stack>
  );
}
