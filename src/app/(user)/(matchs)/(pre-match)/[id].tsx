import { ScreenWrapper } from "@/src/components/screen-wrapper";
import { useLocalSearchParams } from "expo-router";
import { Text, View, StyleSheet, ScrollView, Alert } from "react-native";
import { mockData } from "@/src/data";
import { useState, useEffect } from "react";
import { Jogador, ModalState, Time } from "@/src/types/types";
import { sortearTimes } from "@/src/utils/sortteams";
import Campo from "@/src/components/campo";
import { Button } from "@/src/components/Button";
import { TeamLineup } from "@/src/components/TeamLineup";
import { PlayerPosition } from "@/src/components/PlayerPosition";
import calcularNotaTotal from "@/src/utils/calcularnotas";
import { PlayerSelectionModal } from "@/src/components/PlayerSelectionModal";
import {
  atacantes,
  goalkeepers,
  leftBacks,
  meias,
  rightBacks,
  zagueiros,
} from "@/src/hooks/hofs";

const emptyTime: Time = {
  goleiros: [],
  zagueiros: [],
  lateraisDireitos: [],
  lateraisEsquerdos: [],
  meias: [],
  atacantes: [],
};

export default function PreMatch() {
  const { id } = useLocalSearchParams();
  const [timeAzul, setTimeAzul] = useState<Time>(emptyTime);
  const [timeVermelho, setTimeVermelho] = useState<Time>(emptyTime);
  const [selectedGoalkeeper, setSelectedGoalkeeper] = useState<Jogador | null>(
    null
  );
  const [selectedRightBack, setSelectedRightBack] = useState<Jogador | null>(
    null
  );
  const [selectedZagueiros, setSelectedZagueiros] = useState<Jogador[]>([]);
  const [selectedLeftBack, setSelectedLeftBack] = useState<Jogador | null>(
    null
  );
  const [selectedMeias, setSelectedMeias] = useState<Jogador[]>([]);
  const [selectedAtacantes, setSelectedAtacantes] = useState<Jogador[]>([]);
  const [jogadores, setJogadores] = useState<Jogador[]>(
    mockData.user.grupos
      .flatMap((grupo) => grupo.partidas)
      .find((partida) => partida.id.toString() === id)?.jogadores || []
  );
  const [timeAzulScore, setTimeAzulScore] = useState(0);
  const [timeVermelhoScore, setTimeVermelhoScore] = useState(0);

  const handleSortearTimes = () => {
    try {
      const { timeAzul, timeVermelho } = sortearTimes(jogadores);
      setTimeAzul(timeAzul);
      setTimeVermelho(timeVermelho);

      if (timeAzul.goleiros.length > 0) {
        setSelectedGoalkeeper(timeAzul.goleiros[0]);
      }
      if (timeAzul.lateraisDireitos.length > 0) {
        setSelectedRightBack(timeAzul.lateraisDireitos[0]);
      }
      if (timeAzul.zagueiros.length >= 2) {
        setSelectedZagueiros([timeAzul.zagueiros[0], timeAzul.zagueiros[1]]);
      }
      if (timeAzul.lateraisEsquerdos.length > 0) {
        setSelectedLeftBack(timeAzul.lateraisEsquerdos[0]);
      }
      if (timeAzul.meias.length >= 3) {
        setSelectedMeias([
          timeAzul.meias[0],
          timeAzul.meias[1],
          timeAzul.meias[2],
        ]);
      }
      if (timeAzul.atacantes.length >= 3) {
        setSelectedAtacantes([
          timeAzul.atacantes[0],
          timeAzul.atacantes[1],
          timeAzul.atacantes[2],
        ]);
      }
    } catch (error: unknown) {
      Alert.alert(
        "Erro",
        error instanceof Error ? error.message : "Erro desconhecido"
      );
    }
  };

  const handleZagueiroSelect = (index: number) => (player: Jogador) => {
    setSelectedZagueiros((prev) => {
      const newZagueiros = [...prev];
      newZagueiros[index] = player;
      return newZagueiros;
    });
  };

  const handleMeiaSelect = (index: number) => (player: Jogador) => {
    setSelectedMeias((prev) => {
      const newMeias = [...prev];
      newMeias[index] = player;
      return newMeias;
    });
  };

  const handleAtacanteSelect = (index: number) => (player: Jogador) => {
    setSelectedAtacantes((prev) => {
      const newAtacantes = [...prev];
      newAtacantes[index] = player;
      return newAtacantes;
    });
  };

  const updateTeamScores = () => {
    const azulScore = calcularNotaTotal(timeAzul);
    const vermelhoScore = calcularNotaTotal(timeVermelho);
    setTimeAzulScore(azulScore);
    setTimeVermelhoScore(vermelhoScore);
  };

  useEffect(() => {
    updateTeamScores();
  }, [timeAzul, timeVermelho]);

  const updateTimes = () => {
    // Primeiro, atualize o time azul
    const novoTimeAzul = {
      goleiros: selectedGoalkeeper ? [selectedGoalkeeper] : [],
      lateraisDireitos: selectedRightBack ? [selectedRightBack] : [],
      zagueiros: selectedZagueiros.filter(Boolean),
      lateraisEsquerdos: selectedLeftBack ? [selectedLeftBack] : [],
      meias: selectedMeias.filter(Boolean),
      atacantes: selectedAtacantes.filter(Boolean),
    };

    // Crie um array com todos os jogadores selecionados para o time azul
    const jogadoresTimeAzul = [
      ...novoTimeAzul.goleiros,
      ...novoTimeAzul.lateraisDireitos,
      ...novoTimeAzul.zagueiros,
      ...novoTimeAzul.lateraisEsquerdos,
      ...novoTimeAzul.meias,
      ...novoTimeAzul.atacantes,
    ];

    // Atualize o time vermelho removendo os jogadores que estão no time azul
    const novoTimeVermelho = {
      goleiros: timeVermelho.goleiros.filter(
        (j) => !jogadoresTimeAzul.some((ja) => ja.id === j.id)
      ),
      lateraisDireitos: timeVermelho.lateraisDireitos.filter(
        (j) => !jogadoresTimeAzul.some((ja) => ja.id === j.id)
      ),
      zagueiros: timeVermelho.zagueiros.filter(
        (j) => !jogadoresTimeAzul.some((ja) => ja.id === j.id)
      ),
      lateraisEsquerdos: timeVermelho.lateraisEsquerdos.filter(
        (j) => !jogadoresTimeAzul.some((ja) => ja.id === j.id)
      ),
      meias: timeVermelho.meias.filter(
        (j) => !jogadoresTimeAzul.some((ja) => ja.id === j.id)
      ),
      atacantes: timeVermelho.atacantes.filter(
        (j) => !jogadoresTimeAzul.some((ja) => ja.id === j.id)
      ),
    };

    setTimeAzul(novoTimeAzul);
    setTimeVermelho(novoTimeVermelho);
  };

  useEffect(() => {
    updateTimes();
  }, [
    selectedGoalkeeper,
    selectedRightBack,
    selectedZagueiros,
    selectedLeftBack,
    selectedMeias,
    selectedAtacantes,
  ]);

  const [modalState, setModalState] = useState<ModalState | null>(null);

  const openModal = (
    position: string,
    onSelect: (player: Jogador) => void,
    players: Jogador[],
    selectedPlayers: Jogador[]
  ) => {
    setModalState({
      isVisible: true,
      position,
      onSelect,
      players,
      selectedPlayers,
    });
  };
  const closeModal = () => setModalState(null);

  const handlePositionClick = {
    goalkeeper: () =>
      openModal(
        "Goleiro",
        setSelectedGoalkeeper,
        goalkeepers,
        selectedGoalkeeper ? [selectedGoalkeeper] : []
      ),
    rightBack: () =>
      openModal(
        "Lateral Direito",
        setSelectedRightBack,
        rightBacks,
        selectedRightBack ? [selectedRightBack] : []
      ),
    leftBack: () =>
      openModal(
        "Lateral Esquerdo",
        setSelectedLeftBack,
        leftBacks,
        selectedLeftBack ? [selectedLeftBack] : []
      ),
    zagueiro1: () =>
      openModal(
        "Zagueiro",
        handleZagueiroSelect(0),
        zagueiros,
        selectedZagueiros
      ),
    zagueiro2: () =>
      openModal(
        "Zagueiro",
        handleZagueiroSelect(1),
        zagueiros,
        selectedZagueiros
      ),
    meia1: () => openModal("Meia", handleMeiaSelect(0), meias, selectedMeias),
    meia2: () => openModal("Meia", handleMeiaSelect(1), meias, selectedMeias),
    meia3: () => openModal("Meia", handleMeiaSelect(2), meias, selectedMeias),
    atacante1: () =>
      openModal(
        "Atacante",
        handleAtacanteSelect(0),
        atacantes,
        selectedAtacantes
      ),
    atacante2: () =>
      openModal(
        "Atacante",
        handleAtacanteSelect(1),
        atacantes,
        selectedAtacantes
      ),
    atacante3: () =>
      openModal(
        "Atacante",
        handleAtacanteSelect(2),
        atacantes,
        selectedAtacantes
      ),
  };

  return (
    <ScreenWrapper>
      <ScrollView>
        <View style={styles.timeContainer}>
          <Text>Time Azul</Text>
          <Text>Time Vermelho</Text>
        </View>

        <View style={styles.campoContainer}>
          <View style={styles.campo}>
            <Campo />

            <View style={styles.defesaContainer}>
              <View style={styles.golContainer}>
                <PlayerPosition
                  onPress={handlePositionClick.goalkeeper}
                  playerId={selectedGoalkeeper?.id}
                  label="GOL"
                  style={styles.golButton}
                />
              </View>

              <View style={styles.lateralPosition}>
                <PlayerPosition
                  onPress={handlePositionClick.leftBack}
                  playerId={selectedLeftBack?.id}
                  label="LE"
                  style={styles.defesaPosition}
                />
              </View>
              <PlayerPosition
                onPress={handlePositionClick.zagueiro1}
                playerId={selectedZagueiros[0]?.id}
                label="Z1"
                style={styles.defesaPosition}
              />
              <PlayerPosition
                onPress={handlePositionClick.zagueiro2}
                playerId={selectedZagueiros[1]?.id}
                label="Z2"
                style={styles.defesaPosition}
              />

              <View style={styles.lateralPosition}>
                <PlayerPosition
                  onPress={handlePositionClick.rightBack}
                  playerId={selectedRightBack?.id}
                  label="LD"
                  style={styles.defesaPosition}
                />
              </View>
            </View>

            <View style={styles.meiaContainer}>
              <PlayerPosition
                onPress={handlePositionClick.meia1}
                playerId={selectedMeias[0]?.id}
                label="M1"
              />
              <PlayerPosition
                onPress={handlePositionClick.meia2}
                playerId={selectedMeias[1]?.id}
                label="M2"
              />
              <PlayerPosition
                onPress={handlePositionClick.meia3}
                playerId={selectedMeias[2]?.id}
                label="M3"
              />
              <View style={styles.atacanteContainer}>
                <PlayerPosition
                  onPress={handlePositionClick.atacante1}
                  playerId={selectedAtacantes[0]?.id}
                  label="A1"
                />
                <PlayerPosition
                  onPress={handlePositionClick.atacante2}
                  playerId={selectedAtacantes[1]?.id}
                  label="A2"
                />
                <PlayerPosition
                  onPress={handlePositionClick.atacante3}
                  playerId={selectedAtacantes[2]?.id}
                  label="A3"
                />
              </View>
            </View>
          </View>
        </View>

        <View style={styles.teamsContainer}>
          <TeamLineup
            team={timeAzul}
            color="#007AFF"
            isBlueTeam={true}
            score={timeAzulScore}
          />
          <TeamLineup
            team={timeVermelho}
            color="#FF3B30"
            isBlueTeam={false}
            score={timeVermelhoScore}
          />
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title="Sortear Times"
            size="small"
            onPress={() => handleSortearTimes()}
          />
        </View>

        {modalState && (
          <PlayerSelectionModal
            isVisible={modalState.isVisible}
            onClose={closeModal}
            onSelect={(player) => {
              modalState.onSelect(player);
              closeModal();
            }}
            players={modalState.players}
            position={modalState.position}
            selectedPlayers={modalState.selectedPlayers}
          />
        )}
      </ScrollView>
      <View style={styles.buttonContainer}></View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  timeContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 15,
  },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    padding: 16,
  },

  // Field Styles (unchanged)
  campoContainer: {
    position: "relative",
    width: "100%",
    height: 250,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
  },
  campo: {
    width: "100%",
    height: "100%",
    backgroundColor: "#4CAF50",
    borderRadius: 8,
    padding: 8,
    borderWidth: 2,
    borderColor: "white",
  },

  golContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: -20,
    flex: 1,
  },

  golButton: {
    backgroundColor: "#4CAF50",
    padding: 3,
    borderRadius: 50,
    borderWidth: 1,
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: -270,
    marginRight: 52,
  },

  defesaContainer: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    height: "100%",
    width: "20%",
    gap: 25,
  },

  defesaPosition: {
    backgroundColor: "#4CAF50",
    padding: 3,
    borderRadius: 50,
    borderWidth: 1,
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 30,
    marginTop: -2,
  },

  lateralPosition: {
    marginRight: -30,
  },

  meiaContainer: {
    flex: 1,
    width: "15%",
    flexDirection: "column",
    gap: 22,
    marginTop: -150,
    marginLeft: 90,
    height: 200,
  },

  atacanteContainer: {
    flex: 1,
    width: "15%",
    flexDirection: "column",
    gap: 22,
    marginTop: -186,
    marginLeft: 50,
    height: 200,
  },

  teamsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    gap: 8,
  },

  buttonContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignItems: "center", // Centraliza o botão horizontalmente
  },

  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },

  modalContent: {
    width: "80%",
    padding: 20,
    backgroundColor: "white",
    borderRadius: 20,
    alignItems: "center",
  },

  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },

  goalkeeperItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    width: "100%",
  },
});
