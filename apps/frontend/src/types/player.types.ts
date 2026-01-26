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
  stats: any;
}

export interface PlayerSearchItem {
  id: string;
  name: string;
  country: string;
}
