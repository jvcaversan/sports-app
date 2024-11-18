import { View, StyleSheet } from "react-native";
import { PlayerPosition } from "@/components/prematchsorteio/PlayerPosition";
import { SelectedPlayers } from "@/types/pre-match.types";

interface Time1Props {
  selectedPlayers: SelectedPlayers;
  handleOpenModal: (
    position: string,
    team: "time1" | "time2",
    number?: number
  ) => void;
  handleClearPlayer: (
    position: string,
    number: number,
    team: "time1" | "time2"
  ) => void;
}

export function Time1({
  selectedPlayers,
  handleOpenModal,
  handleClearPlayer,
}: Time1Props) {
  return (
    <View style={styles.time1Container}>
      <View style={styles.time1GolContainer}>
        <PlayerPosition
          onPress={() => handleOpenModal("Goleiro", "time1")}
          playerId={selectedPlayers.time1.goleiro?.id}
          onClear={() => handleClearPlayer("GOL", 1, "time1")}
          label="GOL"
          style={styles.time1GolButton}
        />
      </View>

      <View style={styles.time1DefesaContainer}>
        <View style={styles.time1LateralContainer}>
          <PlayerPosition
            onPress={() => handleOpenModal("Lateral Esquerdo", "time1", 1)}
            playerId={selectedPlayers.time1.lateralEsquerdo?.id}
            onClear={() => handleClearPlayer("LE", 1, "time1")}
            label="LE"
            style={styles.time1DefesaButton}
          />
        </View>
        <PlayerPosition
          onPress={() => handleOpenModal("Zagueiro", "time1", 1)}
          playerId={selectedPlayers.time1.zagueiro1?.id}
          onClear={() => handleClearPlayer("Z1", 1, "time1")}
          label="Z1"
          style={styles.time1DefesaButton}
        />
        <PlayerPosition
          onPress={() => handleOpenModal("Zagueiro", "time1", 2)}
          playerId={selectedPlayers.time1.zagueiro2?.id}
          onClear={() => handleClearPlayer("Z2", 2, "time1")}
          label="Z2"
          style={styles.time1DefesaButton}
        />
        <View style={styles.time1LateralContainer}>
          <PlayerPosition
            onPress={() => handleOpenModal("Lateral Direito", "time1", 1)}
            playerId={selectedPlayers.time1.lateralDireito?.id}
            onClear={() => handleClearPlayer("LD", 1, "time1")}
            label="LD"
            style={styles.time1DefesaButton}
          />
        </View>
      </View>

      <View style={styles.time1MeiaContainer}>
        <PlayerPosition
          onPress={() => handleOpenModal("Meia", "time1", 1)}
          playerId={selectedPlayers.time1.meioCampo1?.id}
          onClear={() => handleClearPlayer("M1", 1, "time1")}
          label="M1"
          style={styles.time1DefesaButton}
        />
        <PlayerPosition
          onPress={() => handleOpenModal("Meia", "time1", 2)}
          playerId={selectedPlayers.time1.meioCampo2?.id}
          onClear={() => handleClearPlayer("M2", 2, "time1")}
          label="M2"
          style={styles.time1DefesaButton}
        />
        <PlayerPosition
          onPress={() => handleOpenModal("Meia", "time1", 3)}
          playerId={selectedPlayers.time1.meioCampo3?.id}
          onClear={() => handleClearPlayer("M3", 3, "time1")}
          label="M3"
          style={styles.time1DefesaButton}
        />
      </View>

      <View style={styles.time1AtacanteContainer}>
        <PlayerPosition
          onPress={() => handleOpenModal("Atacante", "time1", 1)}
          playerId={selectedPlayers.time1.atacante1?.id}
          onClear={() => handleClearPlayer("A1", 1, "time1")}
          label="A1"
          style={styles.time1DefesaButton}
        />
        <PlayerPosition
          onPress={() => handleOpenModal("Atacante", "time1", 2)}
          playerId={selectedPlayers.time1.atacante2?.id}
          onClear={() => handleClearPlayer("A2", 2, "time1")}
          label="A2"
          style={styles.time1DefesaButton}
        />
        <PlayerPosition
          onPress={() => handleOpenModal("Atacante", "time1", 3)}
          playerId={selectedPlayers.time1.atacante3?.id}
          onClear={() => handleClearPlayer("A3", 3, "time1")}
          label="A3"
          style={styles.time1DefesaButton}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  time1Container: {
    height: 200,
    width: "50%",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  time1GolContainer: {
    width: "15%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
  time1GolButton: {
    marginTop: 14,
  },
  time1DefesaContainer: {
    width: "25%",
    height: "100%",
    justifyContent: "space-evenly",
    alignItems: "center",
    gap: 10,
    marginBottom: 14,
    marginLeft: 5,
  },
  time1LateralContainer: {
    width: "100%",
    alignItems: "center",
    marginLeft: 20,
  },
  time1DefesaButton: {
    marginTop: 8,
  },
  time1MeiaContainer: {
    width: "25%",
    height: "100%",
    justifyContent: "space-evenly",
    alignItems: "center",
    marginLeft: 5,
  },
  time1AtacanteContainer: {
    width: "25%",
    height: "100%",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
});
