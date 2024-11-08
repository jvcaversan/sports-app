import { StatTeamLineup } from "@/src/components/prematchsorteio/StatTeamLineup";
import { ScreenWrapper } from "@/src/components/screen-wrapper";
import { mockData } from "@/src/data";
import { useLocalSearchParams } from "expo-router";
import { Text, View, StyleSheet, ScrollView } from "react-native";

function findMatchById(matchId: string) {
  // Search through all groups and their matches
  for (const grupo of mockData.user.grupos) {
    const match = grupo.partidas.find(
      (partida) => partida.id.toString() === matchId
    );
    if (match) return match;
  }
  return null;
}

function orderPlayersByPosition(jogadores: any[]) {
  const positionOrder = {
    Goleiro: 1,
    "Lateral Direito": 2,
    Zagueiro: 3,
    "Lateral Esquerdo": 4,
    Meia: 5,
    Atacante: 6,
  };

  // Primeiro, separamos os zagueiros para garantir que fiquem juntos
  const zagueiros = jogadores.filter((j) => j.posicao === "Zagueiro");
  const outrosJogadores = jogadores.filter((j) => j.posicao !== "Zagueiro");

  // Ordenamos os outros jogadores
  const ordenados = outrosJogadores.sort((a, b) => {
    const posA = positionOrder[a.posicao as keyof typeof positionOrder] || 99;
    const posB = positionOrder[b.posicao as keyof typeof positionOrder] || 99;
    return posA - posB;
  });

  // Encontramos onde inserir os zagueiros (após o lateral direito)
  const lateralDireitoIndex = ordenados.findIndex(
    (j) => j.posicao === "Lateral Direito"
  );

  // Inserimos os zagueiros na posição correta
  if (lateralDireitoIndex !== -1) {
    ordenados.splice(lateralDireitoIndex + 1, 0, ...zagueiros);
  } else {
    // Se não houver lateral direito, colocamos após o goleiro
    const goleiroIndex = ordenados.findIndex((j) => j.posicao === "Goleiro");
    ordenados.splice(
      goleiroIndex !== -1 ? goleiroIndex + 1 : 0,
      0,
      ...zagueiros
    );
  }

  return ordenados;
}

export default function MatchStatus() {
  const params = useLocalSearchParams();
  const match = findMatchById(params.id as string);

  if (!match) {
    return (
      <ScreenWrapper>
        <Text>Partida não encontrada</Text>
      </ScreenWrapper>
    );
  }

  // Dividir jogadores em dois grupos iguais e ordenar cada time
  const halfLength = Math.ceil(match.jogadores.length / 2);
  const time1Jogadores = orderPlayersByPosition(
    match.jogadores.slice(0, halfLength)
  );
  const time2Jogadores = orderPlayersByPosition(
    match.jogadores.slice(halfLength)
  );

  const time1 = {
    nome: "Time Vermelho",
    jogadores: time1Jogadores,
  };

  const time2 = {
    nome: "Time Azul",
    jogadores: time2Jogadores,
  };

  return (
    <ScreenWrapper>
      <ScrollView style={styles.container}>
        <View style={styles.scoreContainer}>
          <View style={styles.scoreBox}>
            <Text style={styles.scoreText}>
              {match.estatisticasPartida.placar.time1} x{" "}
              {match.estatisticasPartida.placar.time2}
            </Text>
          </View>
        </View>

        <View style={styles.teamsContainer}>
          <View style={styles.teamColumn}>
            <Text style={[styles.teamName, { color: "#FF3B30" }]}>
              Time Vermelho
            </Text>
            <StatTeamLineup
              team={time1}
              color="#FF3B30"
              matchStats={match.estatisticasPartida}
            />
          </View>

          <View style={styles.teamColumn}>
            <Text style={[styles.teamName, { color: "#007AFF" }]}>
              Time Azul
            </Text>
            <StatTeamLineup
              team={time2}
              color="#007AFF"
              matchStats={match.estatisticasPartida}
            />
          </View>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scoreContainer: {
    alignItems: "center",
    paddingVertical: 24,
  },
  scoreBox: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  scoreText: {
    fontSize: 32,
    fontWeight: "bold",
  },
  teamsContainer: {
    flexDirection: "row",
    padding: 16,
    gap: 12,
  },
  teamColumn: {
    flex: 1,
  },
  teamName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
});
