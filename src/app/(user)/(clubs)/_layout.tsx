import { Slot, Stack } from "expo-router";

export default function ClubsLayout() {
  return (
    <Stack>
      <Stack.Screen name="(listTeams)" options={{ headerShown: false }} />
    </Stack>
  );
}
