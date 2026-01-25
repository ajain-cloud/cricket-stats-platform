import { Module } from "@nestjs/common";
import { PlayersController } from '../controllers/players.controller';
import { PlayersService } from '../services/players.service';
import { ExternalModule } from '../../external/modules/external.module';
import { CacheModule } from '../../cache/modules/cache.module';

@Module({
  imports: [ExternalModule, CacheModule],
  controllers: [PlayersController],
  providers: [PlayersService]
})

export class PlayersModule {}
