import { useState, useEffect } from "react";
import { Jogador, Time } from "@/src/types/types";
import calcularNotaTotal from "@/src/utils/calcularnotas";

const emptyTime: Time = {
  goleiros: [],
  zagueiros: [],
  lateraisDireitos: [],
  lateraisEsquerdos: [],
  meias: [],
  atacantes: [],
};

interface TeamManagementReturn {
  timeAzul: Time;
  timeVermelho: Time;
  timeAzulScore: number;
  timeVermelhoScore: number;
  selectedGoalkeeper: Jogador | null;
  selectedRightBack: Jogador | null;
  selectedZagueiros: Jogador[];
  selectedLeftBack: Jogador | null;
  selectedMeias: Jogador[];
  selectedAtacantes: Jogador[];
  setSelectedGoalkeeper: (player: Jogador | null) => void;
  setSelectedRightBack: (player: Jogador | null) => void;
  handleZagueiroSelect: (index: number) => (player: Jogador) => void;
  setSelectedLeftBack: (player: Jogador | null) => void;
  handleMeiaSelect: (index: number) => (player: Jogador) => void;
  handleAtacanteSelect: (index: number) => (player: Jogador) => void;
  setTimeAzul: (time: Time) => void;
  setTimeVermelho: (time: Time) => void;
  setSelectedZagueiros: (players: Jogador[]) => void;
  setSelectedMeias: (players: Jogador[]) => void;
  setSelectedAtacantes: (players: Jogador[]) => void;
  jogadores: Jogador[];
  setJogadores: (players: Jogador[]) => void;
}

export function useTeamManagement(): TeamManagementReturn {
  const [timeAzul, setTimeAzul] = useState<Time>(emptyTime);
  const [timeVermelho, setTimeVermelho] = useState<Time>(emptyTime);
  const [selectedGoalkeeper, setSelectedGoalkeeper] = useState<Jogador | null>(
    null
  );
  const [selectedRightBack, setSelectedRightBack] = useState<Jogador | null>(
    null
  );
  const [selectedZagueiros, setSelectedZagueiros] = useState<Jogador[]>([]);
  const [selectedLeftBack, setSelectedLeftBack] = useState<Jogador | null>(
    null
  );
  const [selectedMeias, setSelectedMeias] = useState<Jogador[]>([]);
  const [selectedAtacantes, setSelectedAtacantes] = useState<Jogador[]>([]);
  const [timeAzulScore, setTimeAzulScore] = useState(0);
  const [timeVermelhoScore, setTimeVermelhoScore] = useState(0);
  const [jogadores, setJogadores] = useState<Jogador[]>([]);

  const handleZagueiroSelect = (index: number) => (player: Jogador) => {
    setSelectedZagueiros((prev) => {
      const newZagueiros = [...prev];
      newZagueiros[index] = player;
      return newZagueiros;
    });
  };

  const handleMeiaSelect = (index: number) => (player: Jogador) => {
    setSelectedMeias((prev) => {
      const newMeias = [...prev];
      newMeias[index] = player;
      return newMeias;
    });
  };

  const handleAtacanteSelect = (index: number) => (player: Jogador) => {
    setSelectedAtacantes((prev) => {
      const newAtacantes = [...prev];
      newAtacantes[index] = player;
      return newAtacantes;
    });
  };

  useEffect(() => {
    const updateTimes = () => {
      const novoTimeAzul = {
        goleiros: selectedGoalkeeper ? [selectedGoalkeeper] : [],
        lateraisDireitos: selectedRightBack ? [selectedRightBack] : [],
        zagueiros: selectedZagueiros.filter(Boolean),
        lateraisEsquerdos: selectedLeftBack ? [selectedLeftBack] : [],
        meias: selectedMeias.filter(Boolean),
        atacantes: selectedAtacantes.filter(Boolean),
      };

      const jogadoresTimeAzul = [
        ...novoTimeAzul.goleiros,
        ...novoTimeAzul.lateraisDireitos,
        ...novoTimeAzul.zagueiros,
        ...novoTimeAzul.lateraisEsquerdos,
        ...novoTimeAzul.meias,
        ...novoTimeAzul.atacantes,
      ];

      const novoTimeVermelho = {
        goleiros: timeVermelho.goleiros.filter(
          (j) => !jogadoresTimeAzul.some((ja) => ja.id === j.id)
        ),
        lateraisDireitos: timeVermelho.lateraisDireitos.filter(
          (j) => !jogadoresTimeAzul.some((ja) => ja.id === j.id)
        ),
        zagueiros: timeVermelho.zagueiros.filter(
          (j) => !jogadoresTimeAzul.some((ja) => ja.id === j.id)
        ),
        lateraisEsquerdos: timeVermelho.lateraisEsquerdos.filter(
          (j) => !jogadoresTimeAzul.some((ja) => ja.id === j.id)
        ),
        meias: timeVermelho.meias.filter(
          (j) => !jogadoresTimeAzul.some((ja) => ja.id === j.id)
        ),
        atacantes: timeVermelho.atacantes.filter(
          (j) => !jogadoresTimeAzul.some((ja) => ja.id === j.id)
        ),
      };

      setTimeAzul(novoTimeAzul);
      setTimeVermelho(novoTimeVermelho);
    };

    updateTimes();
  }, [
    selectedGoalkeeper,
    selectedRightBack,
    selectedZagueiros,
    selectedLeftBack,
    selectedMeias,
    selectedAtacantes,
  ]);

  useEffect(() => {
    const azulScore = calcularNotaTotal(timeAzul);
    const vermelhoScore = calcularNotaTotal(timeVermelho);
    setTimeAzulScore(azulScore);
    setTimeVermelhoScore(vermelhoScore);
  }, [timeAzul, timeVermelho]);

  return {
    timeAzul,
    timeVermelho,
    timeAzulScore,
    timeVermelhoScore,
    selectedGoalkeeper,
    selectedRightBack,
    selectedZagueiros,
    selectedLeftBack,
    selectedMeias,
    selectedAtacantes,
    setSelectedGoalkeeper,
    setSelectedRightBack,
    handleZagueiroSelect,
    setSelectedLeftBack,
    handleMeiaSelect,
    handleAtacanteSelect,
    setTimeAzul,
    setTimeVermelho,
    setSelectedZagueiros,
    setSelectedMeias,
    setSelectedAtacantes,
    jogadores,
    setJogadores,
  };
}
