export type GroupType = 'TOP' | 'BAT' | 'BOWL' | 'OPT' | 'RISK';

export interface Player {
  id: string;
  name: string;
  group: GroupType;
  selectionCount: number;
}

export interface Team {
  id: string;
  players: Player[];
  created_at: string;
}

export const GROUP_LIMITS = {
  TOP: 4,   // Top Players
  BAT: 4,   // Batters and All-rounders
  BOWL: 4,  // Bowlers and Tuka
  OPT: 2,   // Optional Players
  RISK: 2   // Risky Options
} as const;

export const GROUP_NAMES = {
  TOP: 'Top Players',
  BAT: 'Batters & All-rounders',
  BOWL: 'Bowlers & Tuka',
  OPT: 'Optional Players',
  RISK: 'Risky Options'
} as const;