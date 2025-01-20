import { View } from "react-native";
import CustomScreen from "@/components/CustomView";

import { Text } from "react-native";
import { useLocalSearchParams } from "expo-router";

export default function () {
  const { id } = useLocalSearchParams();
  return (
    <CustomScreen>
      <View>
        <Text>olá jogador:{id}</Text>
      </View>
    </CustomScreen>
  );
}
