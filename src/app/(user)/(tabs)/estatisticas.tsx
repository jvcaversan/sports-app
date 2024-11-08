import React from "react";
import { View, Text, StyleSheet, useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ScreenWrapper } from "../../../components/screen-wrapper";
import UserStats from "@/src/components/user-stats";
import { LinearGradient } from "expo-linear-gradient";

export default function Stats() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();

  return (
    <ScreenWrapper style={styles.container}>
      <LinearGradient
        colors={["#2E7D32", "#1B5E20"]}
        style={[styles.header, { width }]}
      >
        <View style={[styles.headerContent, { paddingTop: insets.top + 16 }]}>
          <Text style={styles.headerTitle}>Estatísticas</Text>
          <View style={styles.subtitleContainer}>
            <View style={styles.dot} />
            <Text style={styles.headerSubtitle}>Visão Geral</Text>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        <UserStats userId={1} />
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
  },
  header: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  headerContent: {
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 34,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },
  subtitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#4CAF50",
    marginRight: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#FFFFFF",
    opacity: 0.9,
    fontWeight: "500",
  },
  content: {
    flex: 1,
    marginTop: -20,
    backgroundColor: "#FAFAFA",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 20,
    paddingHorizontal: 16,
  },
});
