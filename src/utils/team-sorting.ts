import { Jogador, Time } from "@/types/types";
import { sortearTimes } from "@/utils/sortteams";

interface TeamSortingResult {
  time1: Time; // Use o tipo correto do seu time aqui
  time2: Time; // Use o tipo correto do seu time aqui
}

interface TeamSortingHandlers {
  setTime1: (time: any) => void;
  setTime2: (time: any) => void;
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
  const { time1, time2 } = sortearTimes(jogadores);

  handlers.setTime1(time1);
  handlers.setTime2(time2);

  if (time1.goleiros.length > 0) {
    handlers.setSelectedGoalkeeper(time1.goleiros[0]);
  }
  if (time1.lateraisDireitos.length > 0) {
    handlers.setSelectedRightBack(time1.lateraisDireitos[0]);
  }
  if (time1.zagueiros.length >= 2) {
    handlers.setSelectedZagueiros([time1.zagueiros[0], time1.zagueiros[1]]);
  }
  if (time1.lateraisEsquerdos.length > 0) {
    handlers.setSelectedLeftBack(time1.lateraisEsquerdos[0]);
  }
  if (time1.meias.length >= 3) {
    handlers.setSelectedMeias([time1.meias[0], time1.meias[1], time1.meias[2]]);
  }
  if (time1.atacantes.length >= 3) {
    handlers.setSelectedAtacantes([
      time1.atacantes[0],
      time1.atacantes[1],
      time1.atacantes[2],
    ]);
  }

  return { time1, time2 };
}
