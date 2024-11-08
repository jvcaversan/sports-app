import { ScreenWrapper } from "@/src/components/screen-wrapper";
import { useLocalSearchParams } from "expo-router";
import { Text, View, StyleSheet, ScrollView, Alert } from "react-native";
import { mockData } from "@/src/data";
import { useState } from "react";
import { Jogador } from "@/src/types/types";
import { handleTeamSorting } from "@/src/utils/team-sorting";
import Campo from "@/src/components/prematchsorteio/campo";
import { Button } from "@/src/components/Button";
import { TeamLineup } from "@/src/components/prematchsorteio/TeamLineup";
import { PlayerPosition } from "@/src/components/prematchsorteio/PlayerPosition";
import { useTeamManagement } from "@/src/hooks/useTeamManagement";
import { PlayerSelectionModal } from "@/src/components/PlayerSelectionModal";
import { useModalManagement } from "@/src/hooks/useModalManagement";
import { usePositionHandlers } from "@/src/hooks/usePositionHandlers";
import { usePlayersInitialization } from "@/src/hooks/usePlayersInitialization";

export default function PreMatch() {
  const { id } = useLocalSearchParams();
  const matchId = Array.isArray(id) ? id[0] : id;

  console.log("matchId", matchId);

  const jogadores = usePlayersInitialization(matchId);

  const { modalState, openModal, closeModal } = useModalManagement();

  const {
    timeAzul,
    timeVermelho,
    timeAzulScore,
    timeVermelhoScore,
    selectedGoalkeeper,
    selectedRightBack,
    selectedZagueiros,
    selectedLeftBack,
    selectedMeias,
    selectedAtacantes,
    setSelectedGoalkeeper,
    setSelectedRightBack,
    setSelectedZagueiros,
    handleZagueiroSelect,
    setSelectedLeftBack,
    handleMeiaSelect,
    handleAtacanteSelect,
    setTimeAzul,
    setTimeVermelho,
    setSelectedMeias,
    setSelectedAtacantes,
  } = useTeamManagement();

  const handleSortearTimes = () => {
    try {
      handleTeamSorting(jogadores, {
        setTimeAzul,
        setTimeVermelho,
        setSelectedGoalkeeper,
        setSelectedRightBack,
        setSelectedZagueiros,
        setSelectedLeftBack,
        setSelectedMeias,
        setSelectedAtacantes,
      });
    } catch (error: unknown) {
      Alert.alert(
        "Erro",
        error instanceof Error ? error.message : "Erro desconhecido"
      );
    }
  };

  const handlePositionClick = usePositionHandlers({
    openModal,
    selectedGoalkeeper,
    selectedRightBack,
    selectedLeftBack,
    selectedZagueiros,
    selectedMeias,
    selectedAtacantes,
    setSelectedGoalkeeper,
    setSelectedRightBack,
    setSelectedLeftBack,
    handleZagueiroSelect,
    handleMeiaSelect,
    handleAtacanteSelect,
  });

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

            <View style={styles.timesContainer}>
              <View style={styles.timeAzulContainer}>
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
            onSelect={(player: Jogador) => {
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

  timesContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  timeAzulContainer: {
    height: 250,
    width: "50%",
  },

  timeVermelhoContainer: {
    height: 250,
    width: "52%",
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
    marginLeft: 18,
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
    flexDirection: "column",
    gap: 22,
    marginTop: -186,
    marginLeft: 90,
    width: "12%",
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
