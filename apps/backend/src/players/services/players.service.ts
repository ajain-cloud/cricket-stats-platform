import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CricketApiService } from '../../external/services/cricket-api.service';
import { CacheService } from '../../cache/services/cache.service';
import { PlayerSearchResponseDto } from '../dto/player-search-response.dto';
import { PlayerStatsResponseDto } from '../dto/player-stats-response.dto';
import { PlayerAggregateResponseDto } from '../dto/player-aggregate-response.dto';
import { ExternalApiQuotaService } from '../../common/services/external-api-quota.service';

@Injectable()
export class PlayersService {
  constructor(
    private readonly cricketApiService: CricketApiService,
    private readonly cacheService: CacheService,
    private readonly quotaService: ExternalApiQuotaService,
  ) {}

  async searchPlayers(name: string): Promise<PlayerSearchResponseDto[]> {
    const cacheKey = `players_search_${name.toLowerCase()}`;

    const cached = await this.cacheService.get<any>(cacheKey);
    if (cached) return cached;

    if (!(await this.quotaService.canCall())) {
      throw new HttpException(
        {
          message: 'Daily external API quota exceeded',
          quota: await this.quotaService.getUsage(),
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    const apiResponse = await this.cricketApiService.searchPlayer(name);

    await this.quotaService.increment();

    const players = apiResponse?.data?.map((player) => ({
      id: player.id,
      name: player.name,
      country: player.country,
    })) || [];

    this.cacheService.set(cacheKey, players);
    return players;
  }

  private async getPlayerInfoRaw(id: string) {
    const cacheKey = `player_info_raw_${id}`;

    const cached = await this.cacheService.get<any>(cacheKey);
    if (cached) return cached;

    if (!(await this.quotaService.canCall())) {
      throw new HttpException(
        {
          message: 'Daily external API quota exceeded',
          quota: await this.quotaService.getUsage(),
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    const apiResponse = await this.cricketApiService.getPlayerDetails(id);
    const data = apiResponse?.data;

    await this.quotaService.increment();

    this.cacheService.set(cacheKey, data);
    return data;
  }

  private parseStats(stats: any[]): PlayerStatsResponseDto {
    const result: PlayerStatsResponseDto = { batting: {}, bowling: {} };

    for (const item of stats || []) {
      const type = item.fn?.trim().toLowerCase(); // batting | bowling
      const format = item.matchtype?.trim().toLowerCase(); // test | odi | t20
      const key = item.stat.trim();
      const value = parseFloat(item.value);

      if (type === 'batting') {
        if (!result.batting[format]) {
          result.batting[format] = {};
        }

        if (key === 'm') result.batting[format].matches = value;
        if (key === 'runs') result.batting[format].runs = value;
        if (key === 'avg') result.batting[format].average = value;
        if (key === 'sr') result.batting[format].strikeRate = value;
      }

      if (type === 'bowling') {
        if (!result.bowling[format]) {
          result.bowling[format] = {};
        }

        if (key === 'wkts') result.bowling[format].wickets = value;
        if (key === 'econ') result.bowling[format].economy = value;
        if (key === 'avg') result.bowling[format].average = value;
      }
    }

    return result;
  }

  async getPlayerAggregate(id: string): Promise<PlayerAggregateResponseDto> {
    const data = await this.getPlayerInfoRaw(id);

    return {
      profile: {
        id: data.id,
        name: data.name,
        country: data.country,
        role: data.role,
        battingStyle: data.battingStyle,
        bowlingStyle: data.bowlingStyle,
        playerImg: data.playerImg,
      },
      stats: this.parseStats(data.stats),
    };
  }
}
