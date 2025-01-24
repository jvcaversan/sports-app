import { Stack } from "expo-router";

export default function ClubDetails() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="create-team" />
    </Stack>
  );
}
