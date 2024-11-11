import { StyleSheet, Text, View } from "react-native";
import type { TeamLineupProps } from "../../types/types";
import calcularNotaTotal from "@/utils/calcularnotas";

export function TeamLineup({ team, color, isBlueTeam }: TeamLineupProps) {
  const allPlayers = [
    ...team.goleiros,
    ...team.lateraisDireitos,
    ...team.zagueiros,
    ...team.lateraisEsquerdos,
    ...team.meias,
    ...team.atacantes,
  ];

  function getPositionAbbreviation(position: string) {
    const abbreviations: Record<string, string> = {
      "Lateral Direito": "LD",
      "Lateral Esquerdo": "LE",
      Zagueiro: "Z",
      Meia: "M",
      Atacante: "A",
    };
    return abbreviations[position] || position;
  }

  return (
    <View style={styles.lineupList}>
      <Text style={[styles.lineupTitle, { color }]}>Escalação:</Text>

      {team.goleiros.map((jogador) => (
        <Text key={jogador.id} style={styles.lineupItem}>
          G - {jogador.nome}
        </Text>
      ))}

      {allPlayers
        .filter((jogador) => !team.goleiros.includes(jogador))
        .map((jogador) => (
          <Text key={jogador.id} style={styles.lineupItem}>
            {getPositionAbbreviation(jogador.posicao)} - {jogador.nome}
          </Text>
        ))}

      <View style={styles.notaTotalContainer}>
        <Text style={styles.notaTotalLabel}>Nota Total:</Text>
        <Text style={[styles.notaTotalValue, { color }]}>
          {calcularNotaTotal(team).toFixed(1)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  lineupList: {
    flex: 1,
    backgroundColor: "transparent",
    padding: 8,
    borderRadius: 8,
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  lineupTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  lineupItem: {
    fontSize: 14,
    color: "#333",
    marginVertical: 2,
  },
  notaTotalContainer: {
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    paddingTop: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  notaTotalLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  notaTotalValue: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
