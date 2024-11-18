import { View, StyleSheet } from "react-native";
import { PlayerPosition } from "@/components/prematchsorteio/PlayerPosition";
import { SelectedPlayers } from "@/types/pre-match.types";

interface Time2Props {
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

export function Time2({
  selectedPlayers,
  handleOpenModal,
  handleClearPlayer,
}: Time2Props) {
  return (
    <View style={styles.time2Container}>
      <View style={styles.time2AtacanteContainer}>
        <PlayerPosition
          onPress={() => handleOpenModal("Atacante", "time2", 1)}
          playerId={selectedPlayers.time2.atacante1?.id}
          onClear={() => handleClearPlayer("A1", 1, "time2")}
          label="A1"
          style={styles.time2AtacanteButton}
        />
        <PlayerPosition
          onPress={() => handleOpenModal("Atacante", "time2", 2)}
          playerId={selectedPlayers.time2.atacante2?.id}
          onClear={() => handleClearPlayer("A2", 2, "time2")}
          label="A2"
          style={styles.time2AtacanteButton}
        />
        <PlayerPosition
          onPress={() => handleOpenModal("Atacante", "time2", 3)}
          playerId={selectedPlayers.time2.atacante3?.id}
          onClear={() => handleClearPlayer("A3", 3, "time2")}
          label="A3"
          style={styles.time2AtacanteButton}
        />
      </View>
      <View style={styles.time2MeiaContainer}>
        <PlayerPosition
          onPress={() => handleOpenModal("Meia", "time2", 1)}
          playerId={selectedPlayers.time2.meioCampo1?.id}
          onClear={() => handleClearPlayer("M1", 1, "time2")}
          label="M1"
          style={styles.time2MeiButton}
        />
        <PlayerPosition
          onPress={() => handleOpenModal("Meia", "time2", 2)}
          playerId={selectedPlayers.time2.meioCampo2?.id}
          onClear={() => handleClearPlayer("M2", 2, "time2")}
          label="M2"
          style={styles.time2MeiButton}
        />
        <PlayerPosition
          onPress={() => handleOpenModal("Meia", "time2", 3)}
          playerId={selectedPlayers.time2.meioCampo3?.id}
          onClear={() => handleClearPlayer("M3", 3, "time2")}
          label="M3"
          style={styles.time2MeiButton}
        />
      </View>

      <View style={styles.time2DefesaContainer}>
        <View style={styles.time2LateralContainer}>
          <PlayerPosition
            onPress={() => handleOpenModal("Lateral Esquerdo", "time2", 1)}
            playerId={selectedPlayers.time2.lateralEsquerdo?.id}
            onClear={() => handleClearPlayer("LE", 1, "time2")}
            label="LE"
            style={styles.time2DefesaButton}
          />
        </View>
        <PlayerPosition
          onPress={() => handleOpenModal("Zagueiro", "time2", 1)}
          playerId={selectedPlayers.time2.zagueiro1?.id}
          onClear={() => handleClearPlayer("Z1", 1, "time2")}
          label="Z1"
          style={styles.time2DefesaButton}
        />
        <PlayerPosition
          onPress={() => handleOpenModal("Zagueiro", "time2", 2)}
          playerId={selectedPlayers.time2.zagueiro2?.id}
          onClear={() => handleClearPlayer("Z2", 2, "time2")}
          label="Z2"
          style={styles.time2DefesaButton}
        />
        <View style={styles.time2LateralContainer}>
          <PlayerPosition
            onPress={() => handleOpenModal("Lateral Direito", "time2", 1)}
            playerId={selectedPlayers.time2.lateralDireito?.id}
            onClear={() => handleClearPlayer("LD", 1, "time2")}
            label="LD"
            style={styles.time2DefesaButton}
          />
        </View>
      </View>

      <View style={styles.time2GolContainer}>
        <PlayerPosition
          onPress={() => handleOpenModal("Goleiro", "time2", 1)}
          playerId={selectedPlayers.time2.goleiro?.id}
          onClear={() => handleClearPlayer("GOL", 1, "time2")}
          label="GOL"
          style={styles.time2GolButton}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  time2Container: {
    height: 200,
    width: "50%",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },

  time2GolContainer: {
    width: "15%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },

  time2GolButton: {
    marginTop: 14,
  },

  time2DefesaContainer: {
    width: "25%",
    height: "100%",
    justifyContent: "space-evenly",
    alignItems: "center",
    gap: 10,
    marginBottom: 14,
    marginRight: 5,
  },

  time2LateralContainer: {
    width: "100%",
    alignItems: "center",
    marginRight: 20,
  },

  time2DefesaButton: {
    marginTop: 8,
  },
  time2MeiButton: {
    marginTop: 8,
  },

  time2AtacanteButton: {
    marginTop: 8,
  },

  time2MeiaContainer: {
    width: "25%",
    height: "100%",
    justifyContent: "space-evenly",
    alignItems: "center",
    marginRight: 5,
  },

  time2AtacanteContainer: {
    width: "25%",
    height: "100%",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
});
