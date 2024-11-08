import { Jogador, Time } from "@/src/types/types";
import { sortearTimes } from "@/src/utils/sortteams";

interface TeamSortingResult {
  timeAzul: Time; // Use o tipo correto do seu time aqui
  timeVermelho: Time; // Use o tipo correto do seu time aqui
}

interface TeamSortingHandlers {
  setTimeAzul: (time: any) => void;
  setTimeVermelho: (time: any) => void;
  setSelectedGoalkeeper: (player: Jogador | null) => void;
  setSelectedRightBack: (player: Jogador | null) => void;
  setSelectedZagueiros: (players: Jogador[]) => void;
  setSelectedLeftBack: (player: Jogador | null) => void;
  setSelectedMeias: (players: Jogador[]) => void;
  setSelectedAtacantes: (players: Jogador[]) => void;
}

export function handleTeamSorting(
  jogadores: Jogador[],
  handlers: TeamSortingHandlers
) {
  const { timeAzul, timeVermelho } = sortearTimes(jogadores);

  handlers.setTimeAzul(timeAzul);
  handlers.setTimeVermelho(timeVermelho);

  if (timeAzul.goleiros.length > 0) {
    handlers.setSelectedGoalkeeper(timeAzul.goleiros[0]);
  }
  if (timeAzul.lateraisDireitos.length > 0) {
    handlers.setSelectedRightBack(timeAzul.lateraisDireitos[0]);
  }
  if (timeAzul.zagueiros.length >= 2) {
    handlers.setSelectedZagueiros([
      timeAzul.zagueiros[0],
      timeAzul.zagueiros[1],
    ]);
  }
  if (timeAzul.lateraisEsquerdos.length > 0) {
    handlers.setSelectedLeftBack(timeAzul.lateraisEsquerdos[0]);
  }
  if (timeAzul.meias.length >= 3) {
    handlers.setSelectedMeias([
      timeAzul.meias[0],
      timeAzul.meias[1],
      timeAzul.meias[2],
    ]);
  }
  if (timeAzul.atacantes.length >= 3) {
    handlers.setSelectedAtacantes([
      timeAzul.atacantes[0],
      timeAzul.atacantes[1],
      timeAzul.atacantes[2],
    ]);
  }

  return { timeAzul, timeVermelho };
}
