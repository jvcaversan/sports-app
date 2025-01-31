import { POSITION_CONFIG } from "../types";
import { TeamPlayer } from "../types";

export const sortPlayersByPosition = (players: TeamPlayer[]) => {
  return [...players].sort((a, b) => {
    const aOrder = POSITION_CONFIG[a.position].order;
    const bOrder = POSITION_CONFIG[b.position].order;
    return aOrder - bOrder;
  });
};

export const distributePlayers = (players: TeamPlayer[]) => {
  const teamA: TeamPlayer[] = [];
  const teamB: TeamPlayer[] = [];

  Object.keys(POSITION_CONFIG).forEach((position) => {
    const positionPlayers = players
      .filter((p) => p.position === position)
      .sort(() => Math.random() - 0.5);

    positionPlayers.forEach((player, index) => {
      index % 2 === 0 ? teamA.push(player) : teamB.push(player);
    });
  });

  const remainingPlayers = players.filter(
    (p) => !teamA.includes(p) && !teamB.includes(p)
  );

  remainingPlayers
    .sort(() => Math.random() - 0.5)
    .forEach((player, index) => {
      index % 2 === 0 ? teamA.push(player) : teamB.push(player);
    });

  return { teamA, teamB };
};

export const calculateTeamTotal = (team: TeamPlayer[]) =>
  team.reduce((sum, p) => sum + p.rating, 0);
