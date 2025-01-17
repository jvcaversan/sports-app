import { Link } from "expo-router";
import { Text } from "react-native";
import { TouchableOpacity, StyleSheet } from "react-native";

type ClubListItemProps = {
  club: {
    club_id: string;
    clubs: { name: string };
  };
};

export default function ClubListItem({ club }: ClubListItemProps) {
  return (
    <Link href={`/(user)/(clubs)/(listTeams)/${club.club_id}`} asChild>
      <TouchableOpacity style={styles.clubCard}>
        <Text style={styles.clubName}>{club.clubs.name}</Text>
      </TouchableOpacity>
    </Link>
  );
}

const styles = StyleSheet.create({
  clubCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#f5f5f5",
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  clubName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
});
