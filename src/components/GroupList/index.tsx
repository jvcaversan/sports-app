import { Tables } from "@/types/supabase";
import { Link } from "expo-router";
import { Text } from "react-native";
import { TouchableOpacity, StyleSheet } from "react-native";

type ClubListItemProps = {
  club: Tables<"club_members"> & {
    clubs: Tables<"clubs"> | null;
  };
};

export default function ClubListItem({ club }: ClubListItemProps) {
  if (!club?.club_id || !club?.clubs?.club_name) {
    return null;
  }
  return (
    <Link
      href={{
        pathname: "/(user)/(tabs)/clubs/[clubId]",
        params: { clubId: club.club_id },
      }}
      asChild
    >
      <TouchableOpacity style={styles.clubCard}>
        <Text style={styles.clubName}>{club.clubs.club_name}</Text>
        <Text style={styles.moreInfo}>→</Text>
      </TouchableOpacity>
    </Link>
  );
}

const styles = StyleSheet.create({
  clubCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    padding: 20,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  clubName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1E293B",
    letterSpacing: 0.2,
  },
  moreInfo: {
    color: "#64748B",
    fontSize: 18,
    fontWeight: "700",
    marginLeft: 10,
  },
});
