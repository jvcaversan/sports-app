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
    padding: 16,
    backgroundColor: "#FFF",
    borderRadius: 12,
    marginBottom: 8,
    width: "100%",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  clubName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1E293B",
    flex: 1,
  },
  loadingIndicator: {
    position: "relative",
    right: 0,
    top: 0,
    transform: [],
    marginLeft: 8,
  },
});
