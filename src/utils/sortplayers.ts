import { Jogador } from "../types/types";

export default function distribuirJogadores(
  jogadores: Jogador[],
  quantidade: number
) {
  const MAX_TENTATIVAS = 10;
  let melhorDiferenca = Infinity;
  let melhorTimeAzul: Jogador[] = [];
  let melhorTimeVermelho: Jogador[] = [];

  // Tenta algumas vezes para encontrar a melhor distribuição
  for (let tentativa = 0; tentativa < MAX_TENTATIVAS; tentativa++) {
    const timeAzul: Jogador[] = [];
    const timeVermelho: Jogador[] = [];

    // Melhor embaralhamento dos jogadores
    const jogadoresDisponiveis = [...jogadores].sort(() => Math.random() - 0.5);

    // Distribui os jogadores alternadamente entre os times
    while (
      jogadoresDisponiveis.length > 0 &&
      (timeAzul.length < quantidade || timeVermelho.length < quantidade)
    ) {
      const jogador = jogadoresDisponiveis.pop();
      if (!jogador) break;

      const somaNotasAzul = timeAzul.reduce((sum, j) => sum + j.nota, 0);
      const somaNotasVermelho = timeVermelho.reduce(
        (sum, j) => sum + j.nota,
        0
      );

      if (
        timeAzul.length < quantidade &&
        (timeVermelho.length >= quantidade ||
          somaNotasAzul <= somaNotasVermelho)
      ) {
        timeAzul.push(jogador);
      } else if (timeVermelho.length < quantidade) {
        timeVermelho.push(jogador);
      }
    }

    // Calcula a diferença de notas entre os times
    const diferencaAtual = Math.abs(
      timeAzul.reduce((sum, j) => sum + j.nota, 0) -
        timeVermelho.reduce((sum, j) => sum + j.nota, 0)
    );

    // Se encontrou uma distribuição melhor, guarda ela
    if (diferencaAtual < melhorDiferenca) {
      melhorDiferenca = diferencaAtual;
      melhorTimeAzul = [...timeAzul];
      melhorTimeVermelho = [...timeVermelho];
    }
  }

  return [melhorTimeAzul, melhorTimeVermelho];
}
