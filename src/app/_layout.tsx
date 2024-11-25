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
        >
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(user)" options={{ headerShown: false }} />
          <Stack.Screen name="index" options={{ headerShown: false }} />
        </Stack>
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
