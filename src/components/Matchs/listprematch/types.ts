export type TeamPlayer = {
  id: string;
  name: string;
  position: string;
  rating: number;
};

export type PositionConfig = {
  abbreviation: string;
  quantity: number;
  order: number;
};

export const POSITION_CONFIG: Record<string, PositionConfig> = {
  GOL: { abbreviation: "GOL", quantity: 1, order: 0 },
  LAD: { abbreviation: "LAD", quantity: 1, order: 1 },
  ZAG: { abbreviation: "ZAG", quantity: 2, order: 2 },
  LAE: { abbreviation: "LAE", quantity: 1, order: 3 },
  MEI: { abbreviation: "MEI", quantity: 3, order: 4 },
  ATA: { abbreviation: "ATA", quantity: 3, order: 5 },
} as const;

export type SaveLineupPayload = {
  match_id: string;
  team_name: string;
  players: Array<{ id: string; position: string }>;
};
