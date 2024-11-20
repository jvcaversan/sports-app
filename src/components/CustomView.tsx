import React, { PropsWithChildren } from "react";
import { View, StyleSheet, Platform, StatusBar } from "react-native";

export default function CustomScreen({ children }: PropsWithChildren) {
  return <View style={styles.container}>{children}</View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 49,
    backgroundColor: "#fff",
  },
});
