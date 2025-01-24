import { Stack } from "expo-router";

export default function UserLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="(members)/[memberId]" />
      <Stack.Screen name="(partidas)" />
      <Stack.Screen name="create-match" />
    </Stack>
  );
}
