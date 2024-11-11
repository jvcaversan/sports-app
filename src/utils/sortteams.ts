// sortearTimes.ts
import { Jogador, Time } from "@/types/types";
import distribuirJogadores from "@/utils/sortplayers";

const emptyTime: Time = {
  goleiros: [],
  zagueiros: [],
  lateraisDireitos: [],
  lateraisEsquerdos: [],
  meias: [],
  atacantes: [],
};

export const sortearTimes = (
  jogadores: Jogador[]
): { time1: Time; time2: Time } => {
  // Validar se há jogadores no array
  if (!jogadores || jogadores.length === 0) {
    throw new Error("Nenhum jogador fornecido para o sorteio");
  }

  // Validar se todos os jogadores têm IDs válidos
  const invalidPlayers = jogadores.filter((j) => !j.id);
  if (invalidPlayers.length > 0) {
    throw new Error("Existem jogadores com IDs inválidos no array");
  }

  const porPosicao = {
    goleiro: jogadores.filter((j) => j.posicao === "Goleiro"),
    zagueiro: jogadores.filter((j) => j.posicao === "Zagueiro"),
    lateralDireito: jogadores.filter((j) => j.posicao === "Lateral Direito"),
    lateralEsquerdo: jogadores.filter((j) => j.posicao === "Lateral Esquerdo"),
    meia: jogadores.filter((j) => j.posicao === "Meia"),
    atacante: jogadores.filter((j) => j.posicao === "Atacante"),
  };

  // Verifica o número exato de jogadores necessários
  const numeroExatoJogadores = {
    goleiro: 2, // 1 por time
    zagueiro: 4, // 2 por time
    lateralDireito: 2, // 1 por time
    lateralEsquerdo: 2, // 1 por time
    meia: 6, // 3 por time
    atacante: 6, // 3 por time
  };

  // Verifica se há exatamente o número correto de jogadores por posição
  if (
    porPosicao.goleiro.length !== numeroExatoJogadores.goleiro ||
    porPosicao.zagueiro.length !== numeroExatoJogadores.zagueiro ||
    porPosicao.lateralDireito.length !== numeroExatoJogadores.lateralDireito ||
    porPosicao.lateralEsquerdo.length !==
      numeroExatoJogadores.lateralEsquerdo ||
    porPosicao.meia.length !== numeroExatoJogadores.meia ||
    porPosicao.atacante.length !== numeroExatoJogadores.atacante
  ) {
    throw new Error(
      "É necessário ter exatamente o número correto de jogadores por posição para formar dois times"
    );
  }

  // Distribute players
  const [goleirosA, goleirosB] = distribuirJogadores(porPosicao.goleiro, 1);
  const [zagueirosA, zagueirosB] = distribuirJogadores(porPosicao.zagueiro, 2);
  const [lateraisDireitosA, lateraisDireitosB] = distribuirJogadores(
    porPosicao.lateralDireito,
    1
  );
  const [lateraisEsquerdosA, lateraisEsquerdosB] = distribuirJogadores(
    porPosicao.lateralEsquerdo,
    1
  );
  const [meiasA, meiasB] = distribuirJogadores(porPosicao.meia, 3);
  const [atacantesA, atacantesB] = distribuirJogadores(porPosicao.atacante, 3);

  return {
    time1: {
      goleiros: goleirosA,
      zagueiros: zagueirosA,
      lateraisDireitos: lateraisDireitosA,
      lateraisEsquerdos: lateraisEsquerdosA,
      meias: meiasA,
      atacantes: atacantesA,
    },
    time2: {
      goleiros: goleirosB,
      zagueiros: zagueirosB,
      lateraisDireitos: lateraisDireitosB,
      lateraisEsquerdos: lateraisEsquerdosB,
      meias: meiasB,
      atacantes: atacantesB,
    },
  };
};
