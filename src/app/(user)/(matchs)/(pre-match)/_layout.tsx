import { Tabs, useLocalSearchParams } from "expo-router";
import { useColorScheme } from "react-native";

export default function PreMatchLayout() {
  const colorScheme = useColorScheme();
  const { id } = useLocalSearchParams();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colorScheme === "dark" ? "#fff" : "#000",
        tabBarInactiveTintColor: colorScheme === "dark" ? "#666" : "#999",
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="[id]"
        options={{
          title: "Escalação",
          href: id ? `/(user)/(matchs)/(pre-match)/${id}` : null,
        }}
      />

      <Tabs.Screen
        name="matchstatus"
        options={{
          title: "Estatísticas",
          href: id ? `/(user)/(matchs)/(pre-match)/matchstatus` : null,
        }}
        initialParams={{ id }}
      />
    </Tabs>
  );
}
