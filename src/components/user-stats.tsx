// src/components/UserStats.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons, Entypo, MaterialCommunityIcons } from "@expo/vector-icons";
import { mockData } from "@/src/data";
import { LinearGradient } from "expo-linear-gradient";

interface UserStatsProps {
  userId: number;
}

const UserStats = ({ userId }: UserStatsProps) => {
  const calculateUserStats = (userId: number) => {
    const allMatches = mockData.user.grupos.flatMap((grupo) => grupo.partidas);

    return allMatches.reduce(
      (stats, match) => {
        const playerStats = match.estatisticasJogadores.find(
          (stats) => stats.jogadorId === userId
        );

        if (playerStats) {
          return {
            totalGols: stats.totalGols + playerStats.gols,
            totalFaltas: stats.totalFaltas + playerStats.faltas,
            totalCartoesAmarelos:
              stats.totalCartoesAmarelos + playerStats.cartoesAmarelos,
            totalCartoesVermelhos:
              stats.totalCartoesVermelhos + playerStats.cartoesVermelhos,
            totalPartidas: stats.totalPartidas + 1,
            totalDefesas: stats.totalDefesas + playerStats.defesas,
          };
        }
        return stats;
      },
      {
        totalGols: 0,
        totalFaltas: 0,
        totalCartoesAmarelos: 0,
        totalCartoesVermelhos: 0,
        totalPartidas: 0,
        totalDefesas: 0,
      }
    );
  };

  const userStats = calculateUserStats(userId);

  const stats = [
    {
      icon: "football",
      IconComponent: Ionicons,
      label: "Gols",
      value: userStats.totalGols,
      gradient: ["#2ECC71", "#27AE60"] as const,
    },
    {
      icon: "hand",
      IconComponent: Entypo,
      label: "Defesas",
      value: userStats.totalDefesas,
      gradient: ["#3498DB", "#2980B9"] as const,
    },
    {
      icon: "warning-outline",
      IconComponent: Ionicons,
      label: "Faltas",
      value: userStats.totalFaltas,
      gradient: ["#E67E22", "#D35400"] as const,
    },
    {
      icon: "card",
      IconComponent: MaterialCommunityIcons,
      label: "Cartões Amarelos",
      value: userStats.totalCartoesAmarelos,
      gradient: ["#F1C40F", "#F39C12"] as const,
    },
    {
      icon: "card",
      IconComponent: MaterialCommunityIcons,
      label: "Cartões Vermelhos",
      value: userStats.totalCartoesVermelhos,
      gradient: ["#E74C3C", "#C0392B"] as const,
    },
    {
      icon: "trophy-outline",
      IconComponent: Ionicons,
      label: "Partidas Jogadas",
      value: userStats.totalPartidas,
      gradient: ["#9B59B6", "#8E44AD"] as const,
    },
  ] as const;

  return (
    <View style={styles.statsGrid}>
      {stats.map((stat, index) => (
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
};

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

export default UserStats;
