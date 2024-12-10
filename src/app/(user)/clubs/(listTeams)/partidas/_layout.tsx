import { Slot, Stack } from "expo-router";

export default function PartidasLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="matchstatus" options={{ headerShown: false }} />
    </Stack>
  );
}
