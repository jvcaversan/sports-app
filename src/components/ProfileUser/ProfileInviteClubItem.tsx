import React, { memo } from "react";
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
} from "react-native";

type ClubItemProps = {
  item: {
    club_id: string;
    clubs: {
      name: string;
    };
  };
  onPress: () => void;
  processingClubId: string | null;
};

export const ProfileInviteClubItem = memo(
  ({ item, onPress, processingClubId }: ClubItemProps) => {
    return (
      <TouchableOpacity
        style={styles.clubItem}
        onPress={onPress}
        disabled={!!processingClubId}
      >
        {processingClubId === item.club_id && (
          <ActivityIndicator color="#666" style={styles.loadingIndicator} />
        )}
        <Text style={styles.clubName}>{item.clubs.name}</Text>
      </TouchableOpacity>
    );
  }
);

const styles = StyleSheet.create({
  clubItem: {
    padding: 12,
    backgroundColor: "#F0F0F0",
    borderRadius: 8,
    marginBottom: 8,
    width: "100%",
    alignItems: "center",
    position: "relative",
  },
  clubName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  loadingIndicator: {
    position: "absolute",
    right: 10,
    top: "50%",
    transform: [{ translateY: -8 }],
  },
});
