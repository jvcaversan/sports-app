import { TeamPlayers } from "@/types/pre-match.types";
import { Text, View, StyleSheet } from "react-native";

const positionLabels: { [K in keyof TeamPlayers]: string } = {
  goleiro: "G",
  lateralDireito: "LD",
  zagueiro1: "ZAG",
  zagueiro2: "ZAG",
  lateralEsquerdo: "LE",
  meioCampo1: "MEI",
  meioCampo2: "MEI",
  meioCampo3: "MEI",
  atacante1: "ATA",
  atacante2: "ATA",
  atacante3: "ATA",
};

// Ordem específica das posições
const orderedPositions: (keyof TeamPlayers)[] = [
  "goleiro",
  "lateralDireito",
  "zagueiro1",
  "zagueiro2",
  "lateralEsquerdo",
  "meioCampo1",
  "meioCampo2",
  "meioCampo3",
  "atacante1",
  "atacante2",
  "atacante3",
];

interface TeamLineupProps {
  team: TeamPlayers;
  showTotalScore?: boolean;
  style?: object; // Adiciona a propriedade 'style' para personalizar o estilo
}

export default function TeamLineup({
  team,
  showTotalScore = true,
  style,
}: TeamLineupProps) {
  const totalNotes = Object.values(team).reduce((sum, player) => {
    return player ? sum + (player.nota || 0) : sum;
  }, 0);

  return (
    <View
      style={[styles.defaultContainer, style]} // Aplica o estilo padrão e o estilo passado como prop
    >
      {orderedPositions.map((position) => (
        <Text key={position}>
          {positionLabels[position]} -{" "}
          {team[position] ? team[position].nome : "Vazio"}
        </Text>
      ))}
      {showTotalScore && <Text>Total Score: {totalNotes}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  defaultContainer: {
    flex: 1,
    flexDirection: "column",
    marginBottom: 20,
    gap: 1,
  },
});
