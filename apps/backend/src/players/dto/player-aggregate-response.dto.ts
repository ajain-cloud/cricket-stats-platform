import { PlayerDetailsResponseDto } from "./player-details-response.dto";
import { PlayerStatsResponseDto } from "./player-stats-response.dto";

export class PlayerAggregateResponseDto {
  profile: PlayerDetailsResponseDto;
  stats: PlayerStatsResponseDto;
}
