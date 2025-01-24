import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import CustomScreen from "@/components/CustomView";
import { useStats } from "@/api/stats";
import { useSessionStore } from "@/store/useSessionStore";
import LoadingIndicator from "@/components/ActivityIndicator";
import { StatCard } from "@/components/UserStatistics/StatCard";
import { StatItem } from "@/components/UserStatistics/StatItem";

export default function Stats() {
  const { session } = useSessionStore();

  if (!session) {
    throw new Error("no session");
  }

  const userId = session?.user.id;

  const { data: statsData, isLoading, isError, error } = useStats(userId);

  if (!userId) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Usuário não autenticado</Text>
      </View>
    );
  }

  if (isLoading) {
    return <LoadingIndicator message="Carregando estatísticas..." />;
  }

  if (isError || !statsData) {
    return (
      <View style={styles.errorContainer}>
        <MaterialCommunityIcons name="alert-circle" size={40} color="#dc2626" />
        <Text style={styles.errorText}>
          {error?.message || "Erro ao carregar dados"}
        </Text>
      </View>
    );
  }

  return (
    <CustomScreen>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Estatísticas Gerais</Text>
        </View>

        <View style={styles.mainCard}>
          <View style={styles.cardHeader}>
            <Ionicons name="person" size={24} color="#4f46e5" />
            <Text style={styles.cardTitle}>Desempenho Geral</Text>
          </View>

          <View style={styles.statsGrid}>
            <StatItem
              icon="soccer"
              label="Gols"
              value={statsData.gols || 0}
              color="#10b981"
            />
            <StatItem
              icon="shoe-cleat"
              label="Assistências"
              value={statsData.assistencias || 0}
              color="black"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Defensivos</Text>
          <View style={styles.statsRow}>
            <StatCard
              icon="shield"
              value={statsData.defesas || 0}
              label="Defesas"
            />
            <StatCard
              icon="alert"
              value={statsData.faltas || 0}
              label="Faltas"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Disciplina</Text>
          <View style={styles.statsRow}>
            <StatCard
              icon="card"
              value={statsData.cartoes_amarelos || 0}
              label="Amarelos"
              iconColor="#eab308"
            />
            <StatCard
              icon="card"
              value={statsData.cartoes_vermelhos || 0}
              label="Vermelhos"
              iconColor="#ef4444"
            />
          </View>
        </View>
      </ScrollView>
    </CustomScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingBottom: 20,
    backgroundColor: "#f8fafc",
    paddingTop: 20,
  },
  header: {
    marginBottom: 24,
    paddingHorizontal: 8,
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#1e293b",
    marginBottom: 4,
  },

  mainCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    gap: 12,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1e293b",
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 16,
  },

  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  statsRow: {
    flexDirection: "row",
    gap: 16,
    justifyContent: "space-between",
  },

  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "#fff",
  },
  errorText: {
    fontSize: 18,
    color: "#dc2626",
    textAlign: "center",
    marginTop: 16,
  },
});
