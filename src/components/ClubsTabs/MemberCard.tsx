import { Tables } from "@/types/supabase";
import { Image, Text, View, StyleSheet } from "react-native";

export const MemberCard = ({ member }: { member: Tables<"club_members"> }) => {
  return (
    <View style={styles.memberCard}>
      <View style={styles.memberAvatar}>
        <Image
          source={{ uri: member.photo || "https://github.com/jvcaversan.png" }}
          style={styles.avatarImage}
          defaultSource={{
            uri: member.photo || "https://github.com/jvcaversan.png",
          }}
        />
      </View>
      <View style={styles.memberInfo}>
        <Text style={styles.memberName}>{member.name}</Text>
        <Text style={styles.memberRole}>{member.role}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  memberCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    padding: 14,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  memberAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#0B4619",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
    overflow: "hidden",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    borderRadius: 25,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2c3e50",
  },
  memberRole: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
});
