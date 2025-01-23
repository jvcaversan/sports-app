import React from "react";
import { View, ActivityIndicator, Text, StyleSheet } from "react-native";

interface LoadingStateProps {
  message: string;
  color: string;
}

export const LoadingState = ({ message, color }: LoadingStateProps) => {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={color} />
      <Text style={styles.loadingText}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: "#3498db",
    textAlign: "center",
    marginTop: 10,
  },
});
