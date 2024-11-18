import { Jogador } from "@/types/types";
import { SelectedPlayers } from "@/types/pre-match.types";

interface UsePlayerSelectionProps {
  selectedTeam: "time1" | "time2";
  setSelectedPlayers: (
    callback: (prev: SelectedPlayers) => SelectedPlayers
  ) => void;
  setIsModalOpen: (isOpen: boolean) => void;
}

export function usePlayerSelection({
  selectedTeam,
  setSelectedPlayers,
  setIsModalOpen,
}: UsePlayerSelectionProps) {
  const selecionarJogador = (
    posicao: string,
    jogador: Jogador,
    selectedNumero?: number
  ) => {
    setSelectedPlayers((prev: SelectedPlayers) => {
      const time = prev[selectedTeam];

      if (["Atacante", "Meia", "Zagueiro"].includes(posicao)) {
        const positionMap = {
          Atacante: `atacante${selectedNumero}`,
          Meia: `meioCampo${selectedNumero}`,
          Zagueiro: `zagueiro${selectedNumero}`,
        } as const;

        const position = positionMap[posicao as keyof typeof positionMap];
        if (position) {
          return {
            ...prev,
            [selectedTeam]: { ...time, [position]: jogador },
          };
        }
      }

      const positionMap = {
        Goleiro: "goleiro",
        "Lateral Esquerdo": "lateralEsquerdo",
        "Lateral Direito": "lateralDireito",
      } as const;

      const position = positionMap[posicao as keyof typeof positionMap];
      if (position) {
        return {
          ...prev,
          [selectedTeam]: { ...time, [position]: jogador },
        };
      }

      return prev;
    });

    setIsModalOpen(false);
  };

  return { selecionarJogador };
}
