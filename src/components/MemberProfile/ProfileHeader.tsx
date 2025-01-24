import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

export const ProfileHeader = ({ name, photo, role, joinedAt }) => (
  <View style={styles.profileSection}>
    <Image
      source={{ uri: photo || "https://i.pravatar.cc/150" }}
      style={styles.avatar}
    />
    <Text style={styles.name}>{name}</Text>

    <View style={styles.infoBox}>
      <MaterialIcons name="workspace-premium" size={20} color="#2F4858" />
      <Text style={styles.infoText}>
        {role === "admin" ? "Administrador" : "Membro"}
      </Text>
    </View>

    <View style={styles.infoBox}>
      <MaterialIcons name="event-available" size={20} color="#2F4858" />
      <Text style={styles.infoText}>
        Membro desde {new Date(joinedAt).toLocaleDateString("pt-BR")}
      </Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  profileSection: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    shadowColor: "#2F4858",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
    borderWidth: 3,
    borderColor: "#E9ECEF",
  },
  name: {
    fontSize: 22,
    fontWeight: "600",
    color: "#2F4858",
    marginBottom: 24,
    fontFamily: "Inter-Bold",
  },
  infoBox: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    padding: 16,
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    marginBottom: 12,
  },
  infoText: {
    fontSize: 16,
    color: "#6C757D",
    marginLeft: 12,
    fontFamily: "Inter-Regular",
  },
});
