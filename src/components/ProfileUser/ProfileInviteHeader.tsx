import React, { memo } from "react";
import { View, Text, Image, StyleSheet } from "react-native";

type ProfileHeaderProps = {
  photo?: string;
  name?: string;
};

export const ProfileInviteHeader = memo(
  ({ photo, name }: ProfileHeaderProps) => (
    <View style={styles.profileHeader}>
      <Image
        style={styles.profileImage}
        source={{ uri: photo || "https://github.com/jvcaversan.png" }}
        resizeMode="contain"
      />
      <Text style={styles.playerName}>{name}</Text>
    </View>
  )
);

const styles = StyleSheet.create({
  profileHeader: {
    alignItems: "center",
    marginBottom: 24,
    padding: 20,
    backgroundColor: "#FFF",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
    borderWidth: 3,
    borderColor: "#16A34A",
  },
  playerName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#1E293B",
    textAlign: "center",
  },
});
