import { Injectable } from '@nestjs/common';
import { CricketApiService } from '../../external/services/cricket-api.service';
import { CacheService } from '../../cache/services/cache.service';
import { PlayerSearchResponseDto } from '../dto/player-search-response.dto';

@Injectable()
export class PlayersService {
  constructor(
    private readonly cricketApiService: CricketApiService,
    private readonly cacheService: CacheService
  ) {}

  async searchPlayers(name: string): Promise<PlayerSearchResponseDto[]> {
    const cacheKey = `players_search_${name.toLowerCase()}`;

    const cached = this.cacheService.get<PlayerSearchResponseDto[]>(cacheKey);
    if (cached) return cached;

    const apiResponse = await this.cricketApiService.searchPlayer(name);

    const players = apiResponse?.data?.map((player) => ({
      id: player.id,
      name: player.name,
      country: player.country,
    })) || [];

    this.cacheService.set(cacheKey, players);
    return players;
  }
}
