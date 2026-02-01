import { Module } from "@nestjs/common";
import { PlayersController } from '../controllers/players.controller';
import { PlayersService } from '../services/players.service';
import { ExternalModule } from '../../external/modules/external.module';
import { CacheModule } from '../../cache/modules/cache.module';
import { ExternalApiQuotaService } from "src/common/services/external-api-quota.service";

@Module({
  imports: [ExternalModule, CacheModule],
  controllers: [PlayersController],
  providers: [PlayersService, ExternalApiQuotaService]
})

export class PlayersModule {}
