import { useState, useEffect } from "react";
import { Jogador, Time } from "@/types/types";
import calcularNotaTotal from "@/utils/calcularnotas";

const emptyTime: Time = {
  goleiros: [],
  zagueiros: [],
  lateraisDireitos: [],
  lateraisEsquerdos: [],
  meias: [],
  atacantes: [],
};

interface TeamManagementReturn {
  time1: Time;
  time2: Time;
  time1Score: number;
  time2Score: number;
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
  setTime1: (time: Time) => void;
  setTime2: (time: Time) => void;
  setSelectedZagueiros: (players: Jogador[]) => void;
  setSelectedMeias: (players: Jogador[]) => void;
  setSelectedAtacantes: (players: Jogador[]) => void;
  jogadores: Jogador[];
  setJogadores: (players: Jogador[]) => void;
}

export function useTeamManagement(): TeamManagementReturn {
  const [time1, setTime1] = useState<Time>(emptyTime);
  const [time2, setTime2] = useState<Time>(emptyTime);
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

  const [time1Score, setTime1Score] = useState(0);
  const [time2Score, setTime2Score] = useState(0);
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
      const novoTime1 = {
        goleiros: selectedGoalkeeper ? [selectedGoalkeeper] : [],
        lateraisDireitos: selectedRightBack ? [selectedRightBack] : [],
        zagueiros: selectedZagueiros.filter(Boolean),
        lateraisEsquerdos: selectedLeftBack ? [selectedLeftBack] : [],
        meias: selectedMeias.filter(Boolean),
        atacantes: selectedAtacantes.filter(Boolean),
      };

      const jogadoresTime1 = [
        ...novoTime1.goleiros,
        ...novoTime1.lateraisDireitos,
        ...novoTime1.zagueiros,
        ...novoTime1.lateraisEsquerdos,
        ...novoTime1.meias,
        ...novoTime1.atacantes,
      ];

      const novoTime2: Time = {
        goleiros: time2.goleiros.filter(
          (j) => !jogadoresTime1.some((ja) => ja.id === j.id)
        ),
        lateraisDireitos: time2.lateraisDireitos.filter(
          (j) => !jogadoresTime1.some((ja) => ja.id === j.id)
        ),
        zagueiros: time2.zagueiros.filter(
          (j) => !jogadoresTime1.some((ja) => ja.id === j.id)
        ),
        lateraisEsquerdos: time2.lateraisEsquerdos.filter(
          (j) => !jogadoresTime1.some((ja) => ja.id === j.id)
        ),
        meias: time2.meias.filter(
          (j) => !jogadoresTime1.some((ja) => ja.id === j.id)
        ),
        atacantes: time2.atacantes.filter(
          (j) => !jogadoresTime1.some((ja) => ja.id === j.id)
        ),
      };

      setTime1(novoTime1);
      setTime2(novoTime2);
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
    const time1Score = calcularNotaTotal(time1);
    const time2Score = calcularNotaTotal(time2);
    setTime1Score(time1Score);
    setTime2Score(time2Score);
  }, [time1, time2]);

  return {
    time1,
    time2,
    time1Score,
    time2Score,
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
    setTime1,
    setTime2,
    setSelectedZagueiros,
    setSelectedMeias,
    setSelectedAtacantes,
    jogadores,
    setJogadores,
  };
}
