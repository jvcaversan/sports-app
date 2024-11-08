import { useState } from "react";
import { Jogador, ModalState } from "@/src/types/types";

export function useModalManagement() {
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

  return {
    modalState,
    openModal,
    closeModal,
  };
}
