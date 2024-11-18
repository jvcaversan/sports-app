import useMatchStore from "@/store/store";
import { SelectedPlayers } from "@/types/pre-match.types";

export const clearPlayer = (
  position: string,
  number: number,
  team: "time1" | "time2",
  setSelectedPlayers: (
    callback: (prev: SelectedPlayers) => SelectedPlayers
  ) => void
) => {
  setSelectedPlayers((prev: SelectedPlayers) => ({
    ...prev,
    [team]: {
      ...prev[team],
      goleiro: position === "GOL" ? null : prev[team].goleiro,
      zagueiro1: position === "Z1" ? null : prev[team].zagueiro1,
      zagueiro2: position === "Z2" ? null : prev[team].zagueiro2,
      lateralEsquerdo: position === "LE" ? null : prev[team].lateralEsquerdo,
      lateralDireito: position === "LD" ? null : prev[team].lateralDireito,
      meioCampo1: position === "M1" ? null : prev[team].meioCampo1,
      meioCampo2: position === "M2" ? null : prev[team].meioCampo2,
      meioCampo3: position === "M3" ? null : prev[team].meioCampo3,
      atacante1: position === "A1" ? null : prev[team].atacante1,
      atacante2: position === "A2" ? null : prev[team].atacante2,
      atacante3: position === "A3" ? null : prev[team].atacante3,
    },
  }));
};
