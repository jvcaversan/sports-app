import { ScreenWrapper } from "@/components/screen-wrapper";
import { useLocalSearchParams } from "expo-router";
import { Text, View, StyleSheet, ScrollView, Alert, Image } from "react-native";
import { Jogador } from "@/types/types";
import { handleTeamSorting } from "@/utils/team-sorting";
import { Button } from "@/components/Button";
import { TeamLineup } from "@/components/prematchsorteio/TeamLineup";
import { PlayerPosition } from "@/components/prematchsorteio/PlayerPosition";
import { useTeamManagement } from "@/hooks/useTeamManagement";
import { PlayerSelectionModal } from "@/components/PlayerSelectionModal";
import { useModalManagement } from "@/hooks/useModalManagement";
import { usePositionHandlers } from "@/hooks/usePositionHandlers";
import { usePlayersInitialization } from "@/hooks/usePlayersInitialization";
import { times } from "@/hooks/hofs";

export default function PreMatch() {
  const { id } = useLocalSearchParams();
  const matchId = Array.isArray(id) ? id[0] : id;

  const jogadores = usePlayersInitialization(matchId);

  const { modalState, openModal, closeModal } = useModalManagement();

  const {
    time1,
    time2,
    time1Score,
    time2Score,
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
    setTime1,
    setTime2,
    setSelectedMeias,
    setSelectedAtacantes,
  } = useTeamManagement();

  const handleSortearTimes = () => {
    try {
      handleTeamSorting(jogadores, {
        setTime1,
        setTime2,
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
          <Text>{times.time2.nome}</Text>
          <Text>{times.time1.nome}</Text>
        </View>
        <View style={styles.campoContainer}>
          <Image
            source={require("@/assets/images/campo.jpg")}
            style={styles.campoImage}
          />

          <View style={styles.timesContainer}>
            <View style={styles.time1Container}>
              <View style={styles.time1GolContainer}>
                <PlayerPosition
                  onPress={handlePositionClick.goalkeeper}
                  playerId={time1.goleiros[0]?.id}
                  label="GOL"
                  style={styles.time1GolButton}
                />
              </View>

              <View style={styles.time1DefesaContainer}>
                <View style={styles.time1LateralContainer}>
                  <PlayerPosition
                    onPress={handlePositionClick.leftBack}
                    playerId={time1.lateraisEsquerdos[0]?.id}
                    label="LE"
                    style={styles.time1DefesaButton}
                  />
                </View>
                <PlayerPosition
                  onPress={handlePositionClick.zagueiro1}
                  playerId={time1.zagueiros[0]?.id}
                  label="Z1"
                  style={styles.time1DefesaButton}
                />
                <PlayerPosition
                  onPress={handlePositionClick.zagueiro2}
                  playerId={time1.zagueiros[1]?.id}
                  label="Z2"
                  style={styles.time1DefesaButton}
                />

                <View style={styles.time1LateralContainer}>
                  <PlayerPosition
                    onPress={handlePositionClick.rightBack}
                    playerId={time1.lateraisDireitos[0]?.id}
                    label="LD"
                    style={styles.time1DefesaButton}
                  />
                </View>
              </View>

              <View style={styles.time1MeiaContainer}>
                <PlayerPosition
                  onPress={handlePositionClick.meia1}
                  playerId={time1.meias[0]?.id}
                  label="M1"
                />
                <PlayerPosition
                  onPress={handlePositionClick.meia2}
                  playerId={time1.meias[1]?.id}
                  label="M2"
                />
                <PlayerPosition
                  onPress={handlePositionClick.meia3}
                  playerId={time1.meias[2]?.id}
                  label="M3"
                />
              </View>
              <View style={styles.time1AtacanteContainer}>
                <PlayerPosition
                  onPress={handlePositionClick.atacante1}
                  playerId={time1.atacantes[0]?.id}
                  label="A1"
                />
                <PlayerPosition
                  onPress={handlePositionClick.atacante2}
                  playerId={time1.atacantes[1]?.id}
                  label="A2"
                />
                <PlayerPosition
                  onPress={handlePositionClick.atacante3}
                  playerId={time1.atacantes[2]?.id}
                  label="A3"
                />
              </View>
            </View>

            <View style={styles.time2Container}>
              <View style={styles.time2AtacanteContainer}>
                <PlayerPosition
                  onPress={handlePositionClick.atacante1}
                  playerId={time2.atacantes[0]?.id}
                  label="A1"
                />
                <PlayerPosition
                  onPress={handlePositionClick.atacante2}
                  playerId={time2.atacantes[1]?.id}
                  label="A2"
                />
                <PlayerPosition
                  onPress={handlePositionClick.atacante3}
                  playerId={time2.atacantes[2]?.id}
                  label="A3"
                />
              </View>
              <View style={styles.time2MeiaContainer}>
                <PlayerPosition
                  onPress={handlePositionClick.meia1}
                  playerId={time2.meias[0]?.id}
                  label="M1"
                />
                <PlayerPosition
                  onPress={handlePositionClick.meia2}
                  playerId={time2.meias[1]?.id}
                  label="M2"
                />
                <PlayerPosition
                  onPress={handlePositionClick.meia3}
                  playerId={time2.meias[2]?.id}
                  label="M3"
                />
              </View>

              <View style={styles.time2DefesaContainer}>
                <View style={styles.time2LateralContainer}>
                  <PlayerPosition
                    onPress={handlePositionClick.leftBack}
                    playerId={time2.lateraisEsquerdos[0]?.id}
                    label="LE"
                    style={styles.time2DefesaButton}
                  />
                </View>
                <PlayerPosition
                  onPress={handlePositionClick.zagueiro1}
                  playerId={time2.zagueiros[0]?.id}
                  label="Z1"
                  style={styles.time2DefesaButton}
                />
                <PlayerPosition
                  onPress={handlePositionClick.zagueiro2}
                  playerId={time2.zagueiros[1]?.id}
                  label="Z2"
                  style={styles.time2DefesaButton}
                />
                <View style={styles.time2LateralContainer}>
                  <PlayerPosition
                    onPress={handlePositionClick.rightBack}
                    playerId={time2.lateraisDireitos[0]?.id}
                    label="LD"
                    style={styles.time2DefesaButton}
                  />
                </View>
              </View>

              <View style={styles.time2GolContainer}>
                <PlayerPosition
                  onPress={handlePositionClick.goalkeeper}
                  playerId={time2.goleiros[0]?.id}
                  label="GOL"
                  style={styles.time2GolButton}
                />
              </View>
            </View>
          </View>
        </View>

        <View style={styles.teamsContainer}>
          <TeamLineup
            team={time1}
            color="#007AFF"
            isBlueTeam={true}
            score={time1Score}
          />
          <TeamLineup
            team={time2}
            color="#FF3B30"
            isBlueTeam={false}
            score={time2Score}
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

  timesContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
  },

  time1Container: {
    height: 200,
    width: "50%",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },

  timeVermelhoContainer: {
    height: 250,
    width: "52%",
    backgroundColor: "red",
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
