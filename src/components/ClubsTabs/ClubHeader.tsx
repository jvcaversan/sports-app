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
}

export const ClubHeader = ({ clubName, clubId }: ClubHeaderProps) => {
  const [modalVisible, setModalVisible] = useState(false);
  const { session } = useSessionStore();
  const userId = session?.user.id;

  const {
    data: isAdmin,
    isLoading,
    error,
  } = useIsClubAdmin(clubId, userId || "");

  const handleAddUserPress = () => {
    setModalVisible(true);
  };

  if (isLoading) return null;

  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
      </TouchableOpacity>

      <View style={styles.headerCenter}>
        <Text style={styles.clubName} numberOfLines={1}>
          {clubName}
        </Text>
      </View>

      {isAdmin && (
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => {
              router.navigate(
                `/(user)/(clubs)/(listTeams)/createMatch?clubId=${clubId}`
              );
            }}
          >
            <Ionicons name="add" size={20} color="#FFFFFF" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.iconButton}
            onPress={handleAddUserPress}
          >
            <MaterialIcons name="person-add" size={20} color="#FFFFFF" />
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
    justifyContent: "space-between",
    backgroundColor: "#0B4619",
    paddingVertical: 10,
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
    marginHorizontal: 10,
  },
  clubName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
    letterSpacing: 0.3,
  },
  actionButtons: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconButton: {
    backgroundColor: "#16A34A",
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
});
