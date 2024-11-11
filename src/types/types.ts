export interface Jogador {
  id: number;
  nome: string;
  posicao: string;
  nota: number;
}

export interface Time {
  goleiros: Jogador[];
  zagueiros: Jogador[];
  lateraisDireitos: Jogador[];
  lateraisEsquerdos: Jogador[];
  meias: Jogador[];
  atacantes: Jogador[];
}

export interface SoccerFieldProps {
  timeAzul: Time;
  timeVermelho: Time;
  onPlayerPress: (jogador: Jogador) => void;
}

export interface TeamFormationProps {
  time: Time;
  side: "left" | "right";
  color: string;
  onPlayerPress: (jogador: Jogador) => void;
}

export interface LineupListProps {
  time: Time;
  color: string;
  title: string;
}

export interface TeamSectionProps {
  title: string;
  color: string;
  jogadores: Jogador[];
}

export interface TeamLineupProps {
  team: Time;
  color: string;
  isBlueTeam: boolean;
  score?: number; // Add this line
}

export interface ModalState {
  isVisible: boolean;
  position: string;
  onSelect: (player: Jogador) => void;
  players: Jogador[];
  selectedPlayers: Jogador[];
}
