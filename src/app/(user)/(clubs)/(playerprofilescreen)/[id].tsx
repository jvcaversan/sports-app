import { View, Text } from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";
import CustomScreen from "@/components/CustomView";

export default function PlayerProfileScreen() {
  const { id } = useLocalSearchParams();
  return (
    <CustomScreen>
      <Text>PlayerProfileScreen</Text>
      <Text>usuario com o id de perfil:{id}</Text>
    </CustomScreen>
  );
}
