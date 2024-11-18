import useMatchStore from "@/store/store";

import { Jogador } from "@/types/types";

import {
  atacantes,
  goalkeepers,
  leftBacks,
  meias,
  rightBacks,
  zagueiros,
} from "../hofs";

type HandleOpenModalProps = {
  setSelectedTeam: (team: "time1" | "time2") => void;
  setSelectedNumero: (numero: number | undefined) => void;
  setIsModalOpen: (isOpen: boolean) => void;
  isJogadorSelecionado: (jogador: Jogador) => boolean;
};

export const useModalHandlers = ({
  setSelectedTeam,
  setSelectedNumero,
  setIsModalOpen,
  isJogadorSelecionado,
}: HandleOpenModalProps) => {
  const { setSelectedPosicao, setSelectedJogadores } = useMatchStore();
  const handleOpenModal = (
    posicao: string,
    time: "time1" | "time2",
    numero?: number
  ) => {
    setSelectedPosicao(posicao);
    setSelectedTeam(time);
    setSelectedNumero(numero);

    // Filtra os jogadores por posição e marca os que já estão selecionados
    switch (posicao) {
      case "Goleiro":
        setSelectedJogadores(
          goalkeepers.map((jogador) => ({
            ...jogador,
            disabled: isJogadorSelecionado(jogador),
          }))
        );
        break;
      case "Lateral Direito":
        setSelectedJogadores(
          rightBacks.map((jogador) => ({
            ...jogador,
            disabled: isJogadorSelecionado(jogador),
          }))
        );
        break;
      case "Zagueiro":
        setSelectedJogadores(
          zagueiros.map((jogador) => ({
            ...jogador,
            disabled: isJogadorSelecionado(jogador),
          }))
        );
        break;
      case "Lateral Esquerdo":
        setSelectedJogadores(
          leftBacks.map((jogador) => ({
            ...jogador,
            disabled: isJogadorSelecionado(jogador),
          }))
        );
        break;
      case "Meia":
        setSelectedJogadores(
          meias.map((jogador) => ({
            ...jogador,
            disabled: isJogadorSelecionado(jogador),
          }))
        );
        break;
      case "Atacante":
        setSelectedJogadores(
          atacantes.map((jogador) => ({
            ...jogador,
            disabled: isJogadorSelecionado(jogador),
          }))
        );
        break;
      default:
        setSelectedJogadores([]);
        break;
    }

    setIsModalOpen(true);
  };
  return { handleOpenModal };
};
