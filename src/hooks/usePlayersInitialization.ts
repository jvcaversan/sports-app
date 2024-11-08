import { useState } from "react";
import { Jogador } from "@/src/types/types";
import { mockData } from "@/src/data";

export function usePlayersInitialization(matchId: string) {
  const [jogadores] = useState<Jogador[]>(
    mockData.user.grupos
      .flatMap((grupo) => grupo.partidas)
      .find((partida) => partida.id.toString() === matchId)?.jogadores || []
  );

  return jogadores;
}
