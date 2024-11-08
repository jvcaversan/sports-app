import { Jogador } from "@/src/types/types";
import {
  atacantes,
  goalkeepers,
  leftBacks,
  meias,
  rightBacks,
  zagueiros,
} from "@/src/hooks/hofs";

interface PositionHandlersProps {
  openModal: (
    position: string,
    onSelect: (player: Jogador) => void,
    players: Jogador[],
    selectedPlayers: Jogador[]
  ) => void;
  selectedGoalkeeper: Jogador | null;
  selectedRightBack: Jogador | null;
  selectedLeftBack: Jogador | null;
  selectedZagueiros: Jogador[];
  selectedMeias: Jogador[];
  selectedAtacantes: Jogador[];
  setSelectedGoalkeeper: (player: Jogador | null) => void;
  setSelectedRightBack: (player: Jogador | null) => void;
  setSelectedLeftBack: (player: Jogador | null) => void;
  handleZagueiroSelect: (index: number) => (player: Jogador) => void;
  handleMeiaSelect: (index: number) => (player: Jogador) => void;
  handleAtacanteSelect: (index: number) => (player: Jogador) => void;
}

export function usePositionHandlers({
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
}: PositionHandlersProps) {
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

  return handlePositionClick;
}
