import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

interface ClubHeaderProps {
  clubName: string;
  clubId?: string;
}

export const ClubHeader = ({ clubName, clubId }: ClubHeaderProps) => {
  return (
    <View style={styles.header}>
      <View style={styles.headerContent}>
        <View style={styles.headerLeft}>
          <Text style={styles.clubName}>{clubName}</Text>
        </View>
        <TouchableOpacity
          style={styles.createMatchButton}
          onPress={() => {
            router.navigate(
              `/(user)/(clubs)/(listTeams)/createMatch?clubId=${clubId}`
            );
          }}
        >
          <Ionicons name="add-circle" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#0B4619",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#0a3d15",
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerLeft: {
    flex: 1,
  },
  clubName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
    letterSpacing: 0.3,
  },
  createMatchButton: {
    backgroundColor: "#16A34A",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
});
