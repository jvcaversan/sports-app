import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface StatItemProps {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  label: string;
  value: number | string;
  color?: string;
  iconSize?: number;
}

export const StatItem = ({
  icon,
  label,
  value,
  color = "#4f46e5",
  iconSize = 28,
}: StatItemProps) => {
  return (
    <View style={styles.container}>
      <MaterialCommunityIcons name={icon} size={iconSize} color={color} />
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
};

// Estilos permanecem os mesmos
const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
    backgroundColor: "#f1f5f9",
    borderRadius: 12,
    padding: 16,
  },
  value: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1e293b",
    marginVertical: 8,
  },
  label: {
    fontSize: 14,
    color: "#64748b",
    fontWeight: "500",
    textAlign: "center",
  },
});
