import { Controller, Get, Query } from '@nestjs/common';
import { PlayersService } from '../services/players.service';
import { PlayerSearchResponseDto } from '../dto/player-search-response.dto';

@Controller('players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Get('search')
  async searchPlayers(@Query('search') name: string): Promise<PlayerSearchResponseDto[]> {
    return this.playersService.searchPlayers(name);
  }
}
