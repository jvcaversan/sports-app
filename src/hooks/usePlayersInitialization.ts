// import { useState } from "react";
// import { Jogador } from "../types/types";
// import { mockData } from "../data";

// export function usePlayersInitialization(matchId: string) {
//   const [jogadores] = useState<Jogador[]>(
//     mockData.user.grupos
//       .flatMap((grupo) => grupo.partidas)
//       .find((partida) => partida.id.toString() === matchId)?.jogadores || []
//   );

//   return jogadores;
// }
