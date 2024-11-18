import { Jogador, Time } from "./types";

export interface TeamPlayers {
  goleiro: Jogador | null;
  lateralEsquerdo: Jogador | null;
  zagueiro1: Jogador | null;
  zagueiro2: Jogador | null;
  lateralDireito: Jogador | null;
  meioCampo1: Jogador | null;
  meioCampo2: Jogador | null;
  meioCampo3: Jogador | null;
  atacante1: Jogador | null;
  atacante2: Jogador | null;
  atacante3: Jogador | null;
}

export interface SelectedPlayers {
  time1: TeamPlayers;
  time2: TeamPlayers;
}

export interface ModalVisibility {
  goalkeeper: boolean;
  rightBack: boolean;
  zag1: boolean;
  zag2: boolean;
  leftBack: boolean;
  meia1: boolean;
  meia2: boolean;
  meia3: boolean;
  atacante1: boolean;
  atacante2: boolean;
  atacante3: boolean;
}

export interface TeamScores {
  blueTeam: number;
  redTeam: number;
}

export interface AvailablePlayers {
  goalkeepers: Jogador[];
  rightBacks: Jogador[];
  zagueiros: Jogador[];
  leftBacks: Jogador[];
  meias: Jogador[];
  atacantes: Jogador[];
}
