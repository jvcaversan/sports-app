export const mockData = {
  user: {
    id: 1,
    name: "Jogador Principal",
    email: "jogadorprincipal@example.com",
    grupos: [
      {
        id: 101,
        nomeGrupo: "Amigos do Futebol",
        donoId: 1,
        partidas: [
          {
            id: 201,
            nomePartida: "Partida de Sábado",
            data: "2024-11-10",
            horario: "10:00",
            local: "Campo Central",
            jogadores: [
              {
                id: 1,
                nome: "Jogador Principal",
                posicao: "Atacante",
                nota: 7.5,
              },
              { id: 2, nome: "Jogador 2", posicao: "Goleiro", nota: 8 },
              { id: 3, nome: "Jogador 3", posicao: "Zagueiro", nota: 6 },
              { id: 4, nome: "Jogador 4", posicao: "Zagueiro", nota: 3 },
              { id: 5, nome: "Jogador 5", posicao: "Lateral Direito", nota: 7 },
              {
                id: 6,
                nome: "Jogador 6",
                posicao: "Lateral Esquerdo",
                nota: 8,
              },
              { id: 7, nome: "Jogador 7", posicao: "Meia", nota: 2 },
              { id: 8, nome: "Jogador 8", posicao: "Meia", nota: 8 },
              { id: 9, nome: "Jogador 9", posicao: "Meia", nota: 6 },
              { id: 10, nome: "Jogador 10", posicao: "Atacante", nota: 1 },
              { id: 11, nome: "Jogador 11", posicao: "Atacante", nota: 8 },
              { id: 12, nome: "Jogador 12", posicao: "Atacante", nota: 7 },
              { id: 13, nome: "Jogador 13", posicao: "Goleiro", nota: 8 },
              { id: 14, nome: "Jogador 14", posicao: "Zagueiro", nota: 6 },
              { id: 15, nome: "Jogador 15", posicao: "Zagueiro", nota: 9 },
              {
                id: 16,
                nome: "Jogador 16",
                posicao: "Lateral Direito",
                nota: 7,
              },
              {
                id: 17,
                nome: "Jogador 17",
                posicao: "Lateral Esquerdo",
                nota: 8,
              },
              { id: 18, nome: "Jogador 18", posicao: "Meia", nota: 7 },
              { id: 19, nome: "Jogador 19", posicao: "Meia", nota: 1 },
              { id: 20, nome: "Jogador 20", posicao: "Meia", nota: 6 },
              { id: 21, nome: "Jogador 21", posicao: "Atacante", nota: 9 },
              { id: 22, nome: "Jogador 22", posicao: "Atacante", nota: 8 },
            ],
            times: {
              time1: {
                nome: "Time Vermelho",
                jogadores: [], // Array vazio para ser preenchido após o sorteio
              },
              time2: {
                nome: "Time Azul",
                jogadores: [], // Array vazio para ser preenchido após o sorteio
              },
            },
            estatisticasPartida: {
              placar: { time1: 2, time2: 2 },
              gols: [
                { jogadorId: 1, time: "Time Vermelho", quantidade: 1 },
                { jogadorId: 10, time: "Time Vermelho", quantidade: 1 },
                { jogadorId: 12, time: "Time Azul", quantidade: 1 },
                { jogadorId: 21, time: "Time Azul", quantidade: 1 },
              ],
              cartoesAmarelos: [
                { jogadorId: 5, time: "Time Vermelho", quantidade: 1 },
                { jogadorId: 16, time: "Time Azul", quantidade: 1 },
              ],
              cartoesVermelhos: [
                { jogadorId: 14, time: "Time Azul", quantidade: 1 },
              ],
            },
            estatisticasJogadores: [
              {
                jogadorId: 1,
                gols: 1,
                faltas: 1,
                defesas: 0,
                cartoesAmarelos: 0,
                cartoesVermelhos: 0,
              },
              {
                jogadorId: 2,
                gols: 0,
                faltas: 2,
                defesas: 5,
                cartoesAmarelos: 1,
                cartoesVermelhos: 0,
              },
              {
                jogadorId: 3,
                gols: 0,
                faltas: 1,
                defesas: 0,
                cartoesAmarelos: 0,
                cartoesVermelhos: 0,
              },
              {
                jogadorId: 4,
                gols: 0,
                faltas: 3,
                defesas: 0,
                cartoesAmarelos: 0,
                cartoesVermelhos: 0,
              },
              {
                jogadorId: 5,
                gols: 0,
                faltas: 0,
                defesas: 0,
                cartoesAmarelos: 1,
                cartoesVermelhos: 0,
              },
              {
                jogadorId: 6,
                gols: 0,
                faltas: 1,
                defesas: 0,
                cartoesAmarelos: 0,
                cartoesVermelhos: 0,
              },
              {
                jogadorId: 7,
                gols: 0,
                faltas: 2,
                defesas: 0,
                cartoesAmarelos: 0,
                cartoesVermelhos: 0,
              },
              {
                jogadorId: 8,
                gols: 0,
                faltas: 0,
                defesas: 0,
                cartoesAmarelos: 0,
                cartoesVermelhos: 0,
              },
              {
                jogadorId: 9,
                gols: 0,
                faltas: 1,
                defesas: 0,
                cartoesAmarelos: 0,
                cartoesVermelhos: 0,
              },
              {
                jogadorId: 10,
                gols: 1,
                faltas: 2,
                defesas: 0,
                cartoesAmarelos: 0,
                cartoesVermelhos: 0,
              },
              {
                jogadorId: 11,
                gols: 0,
                faltas: 1,
                defesas: 0,
                cartoesAmarelos: 0,
                cartoesVermelhos: 0,
              },
              {
                jogadorId: 12,
                gols: 1,
                faltas: 1,
                defesas: 0,
                cartoesAmarelos: 0,
                cartoesVermelhos: 0,
              },
              {
                jogadorId: 13,
                gols: 0,
                faltas: 2,
                defesas: 4,
                cartoesAmarelos: 1,
                cartoesVermelhos: 0,
              },
              {
                jogadorId: 14,
                gols: 0,
                faltas: 1,
                defesas: 0,
                cartoesAmarelos: 0,
                cartoesVermelhos: 1,
              },
              {
                jogadorId: 15,
                gols: 0,
                faltas: 2,
                defesas: 0,
                cartoesAmarelos: 0,
                cartoesVermelhos: 0,
              },
              {
                jogadorId: 16,
                gols: 0,
                faltas: 0,
                defesas: 0,
                cartoesAmarelos: 1,
                cartoesVermelhos: 0,
              },
              {
                jogadorId: 17,
                gols: 0,
                faltas: 1,
                defesas: 0,
                cartoesAmarelos: 0,
                cartoesVermelhos: 0,
              },
              {
                jogadorId: 18,
                gols: 0,
                faltas: 1,
                defesas: 0,
                cartoesAmarelos: 0,
                cartoesVermelhos: 0,
              },
              {
                jogadorId: 19,
                gols: 0,
                faltas: 0,
                defesas: 0,
                cartoesAmarelos: 0,
                cartoesVermelhos: 0,
              },
              {
                jogadorId: 20,
                gols: 0,
                faltas: 1,
                defesas: 0,
                cartoesAmarelos: 0,
                cartoesVermelhos: 0,
              },
              {
                jogadorId: 21,
                gols: 1,
                faltas: 2,
                defesas: 0,
                cartoesAmarelos: 0,
                cartoesVermelhos: 0,
              },
              {
                jogadorId: 22,
                gols: 0,
                faltas: 1,
                defesas: 0,
                cartoesAmarelos: 0,
                cartoesVermelhos: 0,
              },
            ],
          },
        ],
      },
    ],
  },
};
