import React from "react";
import {
  View,
  StyleSheet,
  Platform,
  StatusBar,
  StyleProp,
  ViewStyle,
} from "react-native";

interface ScreenWrapperProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function ScreenWrapper({ children, style }: ScreenWrapperProps) {
  return <View style={[styles.container, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: Platform.OS === "ios" ? 47 : StatusBar.currentHeight || 0,
  },
});
