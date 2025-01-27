import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { InvitePlayersModal } from "./inviteplayersmodal";

type Props = {
  matchId: string;
  clubId: string;
};

export const InviteSuplentesButton = ({ matchId, clubId }: Props) => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <>
      <TouchableOpacity
        style={styles.button}
        onPress={() => setModalVisible(true)}
      >
        <LinearGradient
          colors={["#7FDBDA", "#27AE60"]}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Ionicons name="people" size={22} color="white" />
          <Text style={styles.buttonText}>Suplentes</Text>
        </LinearGradient>
      </TouchableOpacity>

      <InvitePlayersModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        matchId={matchId}
        clubId={clubId}
        type="suplentes"
      />
    </>
  );
};

const styles = StyleSheet.create({
  button: {
    flex: 1,
    borderRadius: 12,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#2F80ED",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  gradient: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 15,
    letterSpacing: 0.5,
    textShadowColor: "rgba(0,0,0,0.1)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  disabledButton: {
    opacity: 0.7,
  },
});
