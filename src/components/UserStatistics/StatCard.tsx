import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";

type IconLibrary = typeof MaterialCommunityIcons | typeof Ionicons;

interface StatCardProps {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  value: number | string;
  label: string;
  iconColor?: string;
  iconSize?: number;
}

export const StatCard = ({
  icon,
  value,
  label,
  iconColor = "#4f46e5",
  iconSize = 24,
}: StatCardProps) => {
  return (
    <View style={styles.container}>
      <MaterialCommunityIcons name={icon} size={iconSize} color={iconColor} />
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  value: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1e293b",
    marginVertical: 8,
  },
  label: {
    fontSize: 14,
    color: "#64748b",
    fontWeight: "500",
  },
});
