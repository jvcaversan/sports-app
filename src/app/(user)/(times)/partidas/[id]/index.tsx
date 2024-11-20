import { useLocalSearchParams } from "expo-router";
import { Text, View, StyleSheet, ScrollView, Image } from "react-native";
import { Jogador } from "@/types/types";
import { Button } from "@/components/Button";
import { times } from "@/hooks/hofs";
import { useState } from "react";
import ModalSelectPlayer from "@/components/modal/modal";
import useMatchStore from "@/store/store";
import { useModalHandlers } from "@/hooks/modal/openModal";
import { clearPlayer } from "@/utils/clearPlayer";
import { usePlayerSelection } from "@/hooks/usePlayerSelection";
import { Time1 } from "@/components/prematchsorteio/time1";
import { Time2 } from "@/components/prematchsorteio/time2";
import TeamLineup from "@/components/prematchsorteio/TeamLineup";
import CustomScreen from "@/components/CustomView";
// import { TeamLineup } from "@/components/prematchsorteio/TeamLineup";

export default function PreMatch() {
  const { id } = useLocalSearchParams();

  console.log(id);

  const [selectedTeam, setSelectedTeam] = useState<"time1" | "time2">("time1");
  const [selectedNumero, setSelectedNumero] = useState<number | undefined>();
  const {
    selectedPlayers,
    selectedPosicao,
    selectedJogadores,
    isModalOpen,
    setSelectedPlayers,
    setIsModalOpen,
  } = useMatchStore();

  const isJogadorSelecionado = (jogador: Jogador): boolean => {
    return [
      ...Object.values(selectedPlayers.time1),
      ...Object.values(selectedPlayers.time2),
    ].some((player) => player?.id === jogador.id);
  };

  const { handleOpenModal } = useModalHandlers({
    setSelectedTeam,
    setSelectedNumero,
    setIsModalOpen,
    isJogadorSelecionado,
  });

  const handleClearPlayer = (
    position: string,
    number: number,
    team: "time1" | "time2"
  ) => {
    clearPlayer(position, number, team, setSelectedPlayers);
  };

  const { selecionarJogador } = usePlayerSelection({
    selectedTeam,
    setSelectedPlayers,
    setIsModalOpen,
  });

  return (
    <CustomScreen>
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
            <Time1
              selectedPlayers={selectedPlayers}
              handleOpenModal={handleOpenModal}
              handleClearPlayer={handleClearPlayer}
            />

            <Time2
              selectedPlayers={selectedPlayers}
              handleOpenModal={handleOpenModal}
              handleClearPlayer={handleClearPlayer}
            />
          </View>
        </View>

        <View
          style={{
            flexDirection: "row",
            marginTop: 15,
            padding: 20,
            justifyContent: "space-between",
          }}
        >
          <View style={{ flex: 1 }}>
            <TeamLineup team={selectedPlayers.time1} />
          </View>

          <View style={{ flex: 1 }}>
            <TeamLineup team={selectedPlayers.time2} />
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title="Sortear Times"
            size="small"
            onPress={() => console.log("sorteio")}
          />
        </View>

        <ModalSelectPlayer
          visible={isModalOpen}
          jogadores={selectedJogadores}
          onClose={() => setIsModalOpen(false)}
          onSelect={(jogador) => {
            selecionarJogador(selectedPosicao, jogador, selectedNumero);
          }}
          posicao={selectedPosicao}
        />
        <View style={styles.buttonContainer}></View>
      </ScrollView>
    </CustomScreen>
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

  buttonContainer: {
    alignItems: "center", // Centraliza o botão horizontalmente
    marginTop: 20,
  },
});
