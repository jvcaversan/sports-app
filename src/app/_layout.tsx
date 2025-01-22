import React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Platform } from "react-native";
import QueryProvider from "@/providers/QueryProvider";

export default function RootLayout() {
  return (
    <>
      <QueryProvider>
        <StatusBar style="dark" />
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        />
      </QueryProvider>
    </>
  );
}

const styles = StyleSheet.create({
  listContainer: {
    flexGrow: 1,
    paddingBottom: Platform.OS === "ios" ? 34 : 16,
  },
});
