import { Stack } from "expo-router";

export default function UserScreen() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="(clubs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="(playerprofilescreen)/[id]"
        options={{ headerShown: false }}
      />
    </Stack>
  );
}
