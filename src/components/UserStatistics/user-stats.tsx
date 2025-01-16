// src/components/UserStats.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons, Entypo, MaterialCommunityIcons } from "@expo/vector-icons";

import { LinearGradient } from "expo-linear-gradient";
import { useStats } from "@/api/stats";
import { useSessionStore } from "@/store/useSessionStore";

export default function UserStats() {
  const { session } = useSessionStore();
  const userId = session?.user.id;

  const { data: profile, error, isLoading } = useStats(userId || undefined);

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text>Error: {error.message}</Text>;
  }

  const stats = profile?.statistics?.[0];

  const estatisticas = [
    {
      icon: "football",
      IconComponent: Ionicons,
      label: "Gols",
      value: stats?.gols ?? 0,
      gradient: ["#2ECC71", "#27AE60"] as const,
    },
    {
      icon: "hand",
      IconComponent: Entypo,
      label: "Defesas",
      value: stats?.defesas ?? 0,
      gradient: ["#3498DB", "#2980B9"] as const,
    },
    {
      icon: "warning-outline",
      IconComponent: Ionicons,
      label: "Faltas",
      value: stats?.faltas ?? 0,
      gradient: ["#E67E22", "#D35400"] as const,
    },
    {
      icon: "card",
      IconComponent: MaterialCommunityIcons,
      label: "Cartões Amarelos",
      value: stats?.cartoes_amarelos ?? 0,
      gradient: ["#F1C40F", "#F39C12"] as const,
    },
    {
      icon: "card",
      IconComponent: MaterialCommunityIcons,
      label: "Cartões Vermelhos",
      value: stats?.cartoes_vermelhos ?? 0,
      gradient: ["#E74C3C", "#C0392B"] as const,
    },
    // {
    //   icon: "trophy-outline",
    //   IconComponent: Ionicons,
    //   label: "Partidas Jogadas",
    //   value: userStats.totalPartidas,
    //   gradient: ["#9B59B6", "#8E44AD"] as const,
    // },
  ] as const;

  return (
    <View style={styles.statsGrid}>
      {estatisticas.map((stat, index) => (
        <View key={index} style={styles.statCard}>
          <LinearGradient
            colors={stat.gradient}
            style={styles.iconContainer}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <stat.IconComponent
              name={stat.icon as any}
              size={28}
              color="white"
            />
          </LinearGradient>
          <Text style={styles.statValue}>{stat.value}</Text>
          <Text style={styles.statLabel}>{stat.label}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 12,
    gap: 12,
    justifyContent: "space-between",
  },
  statCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    width: "48%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    marginBottom: 4,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  statValue: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1A1A1A",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666666",
    textAlign: "center",
  },
});
