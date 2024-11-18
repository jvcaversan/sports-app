import { create } from "zustand";
import { Jogador } from "@/types/types";
import { SelectedPlayers } from "@/types/pre-match.types";

interface MatchStore {
  isModalOpen: boolean;
  selectedPosicao: string;
  selectedJogadores: Jogador[];
  selectedPlayers: SelectedPlayers;
  setIsModalOpen: (isOpen: boolean) => void;
  setSelectedPosicao: (posicao: string) => void;
  setSelectedJogadores: (jogadores: Jogador[]) => void;
  setSelectedPlayers: (
    update: SelectedPlayers | ((prev: SelectedPlayers) => SelectedPlayers)
  ) => void;
}

const useMatchStore = create<MatchStore>((set) => ({
  isModalOpen: false,
  selectedPosicao: "",
  selectedJogadores: [],
  selectedPlayers: {
    time1: {
      goleiro: null,
      zagueiro1: null,
      zagueiro2: null,
      lateralEsquerdo: null,
      lateralDireito: null,
      meioCampo1: null,
      meioCampo2: null,
      meioCampo3: null,
      atacante1: null,
      atacante2: null,
      atacante3: null,
    },
    time2: {
      goleiro: null,
      zagueiro1: null,
      zagueiro2: null,
      lateralEsquerdo: null,
      lateralDireito: null,
      meioCampo1: null,
      meioCampo2: null,
      meioCampo3: null,
      atacante1: null,
      atacante2: null,
      atacante3: null,
    },
  },
  setIsModalOpen: (isOpen) => set({ isModalOpen: isOpen }),
  setSelectedPosicao: (posicao) => set({ selectedPosicao: posicao }),
  setSelectedJogadores: (jogadores) => set({ selectedJogadores: jogadores }),
  setSelectedPlayers: (update) =>
    set((state) =>
      typeof update === "function"
        ? { selectedPlayers: update(state.selectedPlayers) }
        : { selectedPlayers: update }
    ),
}));

export default useMatchStore;
