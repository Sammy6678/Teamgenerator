export interface Player {
  id: string;
  name: string;
  group: 'A' | 'B' | 'C' | 'D';
  selectionCount: number;
}

export interface Team {
  id: string;
  players: Player[];
  created_at: string;
}