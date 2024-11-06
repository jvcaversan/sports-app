import { Jogador, Time } from "./types";

export interface SelectedPlayers {
  goalkeeper: Jogador | null;
  rightBack: Jogador | null;
  zagueiros: Jogador[];
  leftBack: Jogador | null;
  meias: Jogador[];
  atacantes: Jogador[];
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
