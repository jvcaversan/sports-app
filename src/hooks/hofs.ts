import { mockData } from "../data";

export const goalkeepers = mockData.user.grupos[0].partidas[0].jogadores.filter(
  (jogador) => jogador.posicao === "Goleiro"
);

export const rightBacks = mockData.user.grupos[0].partidas[0].jogadores.filter(
  (jogador) => jogador.posicao === "Lateral Direito"
);

export const zagueiros = mockData.user.grupos[0].partidas[0].jogadores.filter(
  (jogador) => jogador.posicao === "Zagueiro"
);
export const leftBacks = mockData.user.grupos[0].partidas[0].jogadores.filter(
  (jogador) => jogador.posicao === "Lateral Esquerdo"
);
export const meias = mockData.user.grupos[0].partidas[0].jogadores.filter(
  (jogador) => jogador.posicao === "Meia"
);

export const atacantes = mockData.user.grupos[0].partidas[0].jogadores.filter(
  (jogador) => jogador.posicao === "Atacante"
);
