import { Jogador } from "@/src/types/types";

export function filterPlayersByPosition(jogadores: Jogador[]) {
  return {
    goalkeepers: jogadores.filter((jogador) => jogador.posicao === "Goleiro"),
    rightBacks: jogadores.filter(
      (jogador) => jogador.posicao === "Lateral Direito"
    ),
    zagueiros: jogadores.filter((jogador) => jogador.posicao === "Zagueiro"),
    leftBacks: jogadores.filter(
      (jogador) => jogador.posicao === "Lateral Esquerdo"
    ),
    meias: jogadores.filter((jogador) => jogador.posicao === "Meia"),
    atacantes: jogadores.filter((jogador) => jogador.posicao === "Atacante"),
  };
}
