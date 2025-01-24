import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

export const AdminActions = ({ currentRole, onUpdateRole, onRemoveMember }) => (
  <View style={styles.actionsSection}>
    <Text style={styles.sectionTitle}>Ações de Administrador</Text>

    <View style={styles.roleSelector}>
      {["member", "admin"].map((role) => (
        <TouchableOpacity
          key={role}
          style={[styles.roleButton, currentRole === role && styles.activeRole]}
          onPress={() => onUpdateRole(role)}
        >
          <Text
            style={[
              styles.roleText,
              currentRole === role && styles.activeRoleText,
            ]}
          >
            {role === "admin" ? "Admin" : "Membro"}
          </Text>
        </TouchableOpacity>
      ))}
    </View>

    <TouchableOpacity style={styles.removeButton} onPress={onRemoveMember}>
      <Text style={styles.buttonText}>Remover do Clube</Text>
      <MaterialIcons name="person-remove" size={20} color="white" />
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  actionsSection: {
    marginTop: 24,
    backgroundColor: "white",
    borderRadius: 16,
    padding: 24,
    shadowColor: "#2F4858",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2F4858",
    marginBottom: 20,
    fontFamily: "Inter-SemiBold",
  },
  roleSelector: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  roleButton: {
    flex: 1,
    padding: 14,
    backgroundColor: "#F8F9FA",
    borderRadius: 10,
    marginHorizontal: 4,
    alignItems: "center",
  },
  activeRole: {
    backgroundColor: "#0B4619",
  },
  roleText: {
    fontSize: 16,
    color: "#6C757D",
    fontFamily: "Inter-Medium",
  },
  activeRoleText: {
    color: "white",
  },
  updateButton: {
    backgroundColor: "#0B4619",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  removeButton: {
    backgroundColor: "#DC3545",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontFamily: "Inter-SemiBold",
    marginRight: 10,
  },
});
