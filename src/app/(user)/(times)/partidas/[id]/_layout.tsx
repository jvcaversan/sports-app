import { Slot, Tabs } from "expo-router";
import { useLocalSearchParams } from "expo-router";
import { View } from "react-native";

export default function PreMatchLayout() {
  const { id } = useLocalSearchParams();

  return <Slot />;
}
