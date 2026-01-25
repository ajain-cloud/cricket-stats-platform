import { Controller, Get, Param, Query } from '@nestjs/common';
import { PlayersService } from '../services/players.service';
import { PlayerSearchResponseDto } from '../dto/player-search-response.dto';
import { PlayerAggregateResponseDto } from '../dto/player-aggregate-response.dto';

@Controller('players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Get('search')
  async searchPlayers(@Query('search') name: string): Promise<PlayerSearchResponseDto[]> {
    return this.playersService.searchPlayers(name);
  }

  @Get(':id')
  async getPlayerDetails(@Param('id') id: string): Promise<PlayerAggregateResponseDto> {
    return this.playersService.getPlayerAggregate(id);
  }
}
