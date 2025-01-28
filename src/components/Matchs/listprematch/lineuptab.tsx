import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

export default function LineUpTab() {
  return (
    <View style={styles.container}>
      <MaterialIcons name="construction" size={48} color="#f1c40f" />
      <Text style={styles.title}>Escalação em desenvolvimento</Text>
      <Text style={styles.subtitle}>Em breve você poderá montar seu time!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2c3e50",
    marginTop: 16,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#7f8c8d",
    marginTop: 8,
    textAlign: "center",
  },
});
