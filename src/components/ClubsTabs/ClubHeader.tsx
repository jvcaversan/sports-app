import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

interface ClubHeaderProps {
  clubName: string;
  clubId: string;
}

export const ClubHeader = ({ clubName, clubId }: ClubHeaderProps) => {
  return (
    <View style={styles.header}>
      {/* Botão de Voltar */}
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
      </TouchableOpacity>

      {/* Nome do Clube (Centralizado) */}
      <View style={styles.headerCenter}>
        <Text style={styles.clubName} numberOfLines={1}>
          {clubName}
        </Text>
      </View>

      {/* Botão de Criar Grupo */}
      <TouchableOpacity
        style={styles.createGroupButton}
        onPress={() => {
          router.navigate(
            `/(user)/(clubs)/(listTeams)/createMatch?clubId=${clubId}`
          );
        }}
      >
        <Ionicons name="add" size={24} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#0B4619",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#0A3D15",
  },
  backButton: {
    padding: 8,
  },
  headerCenter: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 16,
  },
  clubName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    letterSpacing: 0.3,
  },
  createGroupButton: {
    backgroundColor: "#16A34A",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
});
