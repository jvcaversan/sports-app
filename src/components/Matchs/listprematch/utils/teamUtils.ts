import { POSITION_CONFIG, TeamPlayer } from "../types";

interface BalancedTeams {
  teamA: TeamPlayer[];
  teamB: TeamPlayer[];
  substitutes: TeamPlayer[];
  totalA: number;
  totalB: number;
}

export function createBalancedTeams(
  mensalistas: TeamPlayer[],
  suplentes: TeamPlayer[]
): BalancedTeams {
  const MAX_MENSALISTAS = 22;
  const RATING_TOLERANCE = 1.5;

  const sortedMensalistas = [...mensalistas].sort(
    (a, b) => b.rating - a.rating
  );
  const excessMensalistas = sortedMensalistas.splice(MAX_MENSALISTAS);
  const allSuplentes = [...suplentes, ...excessMensalistas];

  const { mensalistasByPos, suplentesByPos } = groupPlayersByPosition(
    sortedMensalistas,
    allSuplentes
  );

  const selectedPlayers = selectPlayersForPositions(
    mensalistasByPos,
    suplentesByPos
  );

  const distributed = distributeAndBalanceTeams(
    selectedPlayers,
    RATING_TOLERANCE
  );

  const allPlayers = [...sortedMensalistas, ...allSuplentes];
  const usedIds = new Set(
    [...distributed.teamA, ...distributed.teamB].map((p) => p.id)
  );
  const substitutes = allPlayers.filter((p) => !usedIds.has(p.id));

  return {
    ...distributed,
    substitutes,
  };
}

function groupPlayersByPosition(
  mensalistas: TeamPlayer[],
  suplentes: TeamPlayer[]
) {
  const mensalistasByPos: Record<string, TeamPlayer[]> = {};
  const suplentesByPos: Record<string, TeamPlayer[]> = {};

  for (const position of Object.keys(POSITION_CONFIG)) {
    mensalistasByPos[position] = mensalistas
      .filter((p) => p.position === position)
      .sort((a, b) => b.rating - a.rating);

    suplentesByPos[position] = suplentes
      .filter((p) => p.position === position)
      .sort((a, b) => b.rating - a.rating);
  }

  return { mensalistasByPos, suplentesByPos };
}

function selectPlayersForPositions(
  mensalistasByPos: Record<string, TeamPlayer[]>,
  suplentesByPos: Record<string, TeamPlayer[]>
) {
  return Object.entries(POSITION_CONFIG).flatMap(([position, config]) => {
    const required = config.quantity * 2;
    const mensalistas = mensalistasByPos[position] || [];
    const suplentes = suplentesByPos[position] || [];

    const needed = Math.max(required - mensalistas.length, 0);
    const selectedSuplentes = suplentes.slice(0, needed);

    return [...mensalistas.slice(0, required), ...selectedSuplentes].slice(
      0,
      required
    );
  });
}

function distributeAndBalanceTeams(
  players: TeamPlayer[],
  tolerance: number
): BalancedTeams {
  let bestBalance: BalancedTeams = {
    teamA: [],
    teamB: [],
    substitutes: [],
    totalA: 0,
    totalB: 0,
  };
  let smallestDiff = Infinity;

  for (let i = 0; i < 100; i++) {
    const groupedPlayers = Object.keys(POSITION_CONFIG).flatMap((position) => {
      const group = players.filter((p) => p.position === position);
      return group.sort(() => Math.random() - 0.5);
    });

    const shuffled = [...groupedPlayers].sort((a, b) => {
      const posA = POSITION_CONFIG[a.position]?.order || Infinity;
      const posB = POSITION_CONFIG[b.position]?.order || Infinity;
      return posA - posB;
    });

    const teamA: TeamPlayer[] = [];
    const teamB: TeamPlayer[] = [];
    let totalA = 0,
      totalB = 0;

    for (const player of shuffled) {
      if (totalA <= totalB) {
        teamA.push(player);
        totalA += player.rating;
      } else {
        teamB.push(player);
        totalB += player.rating;
      }
    }

    const diff = Math.abs(totalA - totalB);
    if (diff < smallestDiff) {
      smallestDiff = diff;
      bestBalance = {
        teamA,
        teamB,
        substitutes: [],
        totalA,
        totalB,
      };
      if (diff <= tolerance) break;
    }
  }

  return {
    teamA: bestBalance.teamA.sort(
      (a, b) =>
        POSITION_CONFIG[a.position].order - POSITION_CONFIG[b.position].order
    ),
    teamB: bestBalance.teamB.sort(
      (a, b) =>
        POSITION_CONFIG[a.position].order - POSITION_CONFIG[b.position].order
    ),
    substitutes: bestBalance.substitutes,
    totalA: bestBalance.totalA,
    totalB: bestBalance.totalB,
  };
}
