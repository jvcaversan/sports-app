import { useLocalSearchParams } from "expo-router";
import { Text, View, StyleSheet, ScrollView, Image } from "react-native";

// import { times } from "@/hooks/hofs";
import { useState } from "react";

import CustomScreen from "@/components/CustomView";

export default function PreMatch() {
  const { id } = useLocalSearchParams();

  const [selectedTeam, setSelectedTeam] = useState<"time1" | "time2">("time1");
  const [selectedNumero, setSelectedNumero] = useState<number | undefined>();

  return (
    <CustomScreen>
      <ScrollView>
        {/* <View style={styles.timeContainer}>
          <Text>{times.time2.nome}</Text>
          <Text>{times.time1.nome}</Text>
        </View> */}
        <View style={styles.campoContainer}>
          <Image
            source={require("@/images/campo.jpg")}
            style={styles.campoImage}
          />
        </View>
      </ScrollView>
    </CustomScreen>
  );
}

const styles = StyleSheet.create({
  timeContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 15,
  },

  campoContainer: {
    width: "100%",
    height: 260,
    position: "relative",
  },
  campoImage: {
    width: "100%",
    height: "105%",
    resizeMode: "contain",
    alignSelf: "center",
  },
});
