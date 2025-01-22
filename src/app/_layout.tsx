import React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
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
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(user)" />
          <Stack.Screen name="index" />
        </Stack>
      </QueryProvider>
    </>
  );
}
