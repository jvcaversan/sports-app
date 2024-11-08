import { View, Text, StyleSheet } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";

interface StatTeamLineupProps {
  team: {
    nome: string;
    jogadores: Array<{
      id: number;
      nome: string;
      posicao: string;
    }>;
  };
  color: string;
  matchStats: {
    gols: { jogadorId: number; time: string; quantidade: number }[];
    cartoesAmarelos: { jogadorId: number; time: string; quantidade: number }[];
    cartoesVermelhos: { jogadorId: number; time: string; quantidade: number }[];
  };
}

function formatPosition(posicao: string) {
  const positionMap: Record<string, string> = {
    Goleiro: "GOL",
    "Lateral Direito": "LD",
    Zagueiro: "ZAG",
    "Lateral Esquerdo": "LE",
    Meia: "MEI",
    Atacante: "ATA",
  };

  return positionMap[posicao] || posicao;
}

export function StatTeamLineup({
  team,
  color,
  matchStats,
}: StatTeamLineupProps) {
  const getPlayerStats = (playerId: number) => {
    const gols = matchStats.gols
      .filter((g) => g.jogadorId === playerId)
      .reduce((acc, curr) => acc + curr.quantidade, 0);
    const amarelos = matchStats.cartoesAmarelos.filter(
      (c) => c.jogadorId === playerId
    ).length;
    const vermelhos = matchStats.cartoesVermelhos.filter(
      (c) => c.jogadorId === playerId
    ).length;

    return { gols, amarelos, vermelhos };
  };

  return (
    <View style={styles.container}>
      {team.jogadores.map((jogador, index) => {
        const stats = getPlayerStats(jogador.id);
        const isLastPlayer = index === team.jogadores.length - 1;

        return (
          <View key={jogador.id}>
            <View style={styles.playerRow}>
              <View style={styles.positionContainer}>
                <Text style={[styles.position, { color }]}>
                  {formatPosition(jogador.posicao)}
                </Text>
              </View>

              <View style={styles.positionNameContainer}>
                <Text style={[styles.playerName, { color }]} numberOfLines={1}>
                  {jogador.nome}
                </Text>
              </View>

              <View style={styles.statsContainer}>
                {stats.gols > 0 && (
                  <View style={styles.statItem}>
                    <FontAwesome5 name="futbol" size={14} color={color} />
                    <Text style={[styles.statText, { color }]}>
                      {stats.gols}
                    </Text>
                  </View>
                )}
                {stats.amarelos > 0 && (
                  <View style={styles.cardContainer}>
                    <MaterialIcons name="square" size={14} color="#FFD700" />
                  </View>
                )}
                {stats.vermelhos > 0 && (
                  <View style={styles.cardContainer}>
                    <MaterialIcons name="square" size={14} color="#FF0000" />
                  </View>
                )}
              </View>
            </View>
            {!isLastPlayer && (
              <View
                style={[styles.divider, { backgroundColor: color + "20" }]}
              />
            )}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
  },
  playerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
    flex: 1,
  },
  positionContainer: {
    width: 28,
    flexShrink: 0,
  },
  positionNameContainer: {
    flex: 1,
    marginRight: 4,
  },
  position: {
    fontSize: 10,
    fontWeight: "bold",
  },
  playerName: {
    fontSize: 12,
    fontWeight: "500",
  },
  statsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    width: 45,
    justifyContent: "flex-end",
    flexShrink: 0,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statText: {
    fontSize: 10,
    fontWeight: "500",
  },
  cardContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  divider: {
    height: 1,
    marginVertical: 4,
  },
});
