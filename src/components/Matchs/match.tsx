import { useStaticsByMatchId } from "@/api/createMatch";
import { ScrollView, View, StyleSheet, Text } from "react-native";

export default function LiveMatchTab({ matchId }: { matchId: string }) {
  const { data: matchs } = useStaticsByMatchId(matchId);
  const match = matchs?.[0];

  return (
    <ScrollView>
      <Text style={styles.title}>Partida em Andamento</Text>
      <View style={styles.fieldContainer}></View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  fieldContainer: {
    margin: 16,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    minHeight: 300,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    padding: 16,
    textAlign: "center",
  },
});
