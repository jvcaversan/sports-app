import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import InviteClubModal from "../modal/modalinviteuserclub";
import { useSessionStore } from "@/store/useSessionStore";
import { useIsClubAdmin } from "@/api/club_members";

interface ClubHeaderProps {
  clubName: string;
  clubId: string;
  isAdmin: boolean;
  onDelete: () => void;
}

export const ClubHeader = ({
  clubName,
  clubId,
  isAdmin,
  onDelete,
}: ClubHeaderProps) => {
  const [modalVisible, setModalVisible] = useState(false);
  const { session } = useSessionStore();
  const userId = session?.user.id;

  const handleAddUserPress = () => {
    setModalVisible(true);
  };

  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
      </TouchableOpacity>

      <View style={styles.headerCenter}>
        <Text style={styles.clubName} numberOfLines={1}>
          {clubName}
        </Text>
      </View>

      {isAdmin && (
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.iconButton, styles.dangerButton]}
            onPress={onDelete}
          >
            <Ionicons name="trash-outline" size={20} color="#FFFFFF" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.iconButton}
            onPress={handleAddUserPress}
          >
            <MaterialIcons name="group-add" size={24} color="#16A34A" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.iconButton}
            onPress={() =>
              router.navigate(`/(user)/(tabs)/clubs/${clubId}/create-match`)
            }
          >
            <Ionicons name="add-circle-outline" size={24} color="#16A34A" />
          </TouchableOpacity>

          <InviteClubModal
            visible={modalVisible}
            onClose={() => setModalVisible(false)}
            clubId={clubId}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#22C55E",
    paddingVertical: 14,
    paddingHorizontal: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  backButton: {
    padding: 5,
  },
  headerCenter: {
    flex: 1,
    marginHorizontal: 0,
  },
  clubName: {
    fontSize: 20,
    fontWeight: "600",
    color: "#FFFFFF",
    textAlign: "center",
    letterSpacing: 0.5,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
    marginLeft: 8,
  },
  iconButton: {
    backgroundColor: "#FFFFFF",
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    padding: 8,
  },
  dangerButton: {
    backgroundColor: "#ef4444",
  },
});
