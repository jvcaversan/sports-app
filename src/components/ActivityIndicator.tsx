import React from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";

type LoadingIndicatorProps = {
  message?: string;
  color?: string;
};

const LoadingIndicator = ({
  message = "Carregando...",
  color = "#16A34A",
}: LoadingIndicatorProps) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={color} />
      <Text style={[styles.text, { color }]}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    gap: 12,
  },
  text: {
    fontSize: 16,
    fontWeight: "500",
  },
});

export default LoadingIndicator;
