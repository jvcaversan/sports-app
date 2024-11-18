import { Tabs } from "expo-router";
import { useLocalSearchParams } from "expo-router";
import { View } from "react-native";

export default function PreMatchLayout() {
  const { id } = useLocalSearchParams();

  return (
    <View style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Escalação",
          }}
        />
        <Tabs.Screen
          name="matchstatus"
          options={{
            title: "Estatísticas",
          }}
        />
      </Tabs>
    </View>
  );
}
