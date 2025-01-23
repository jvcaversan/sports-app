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
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
  },
  playerName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
});
