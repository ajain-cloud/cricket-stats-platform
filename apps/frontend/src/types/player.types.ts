export interface PlayerProfile {
  id: string;
  name: string;
  country: string;
  role: string;
  battingStyle?: string;
  bowlingStyle?: string;
  playerImg?: string;
}

export interface PlayerAggregateResponse {
  profile: PlayerProfile;
  stats: PlayerStats;
}

export interface PlayerSearchItem {
  id: string;
  name: string;
  country: string;
}

export interface FormatBattingStats {
  matches?: number;
  runs?: number;
  average?: number;
  strikeRate?: number;
}

export interface FormatBowlingStats {
  wickets?: number;
  economy?: number;
  average?: number;
}

export interface PlayerStats {
  batting: Record<string, FormatBattingStats>;
  bowling: Record<string, FormatBowlingStats>;
}
