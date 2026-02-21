import { Module } from "@nestjs/common";
import { PlayersController } from '../controllers/players.controller';
import { PlayersService } from '../services/players.service';
import { ExternalModule } from '../../external/modules/external.module';
import { CacheModule } from '../../cache/modules/cache.module';
import { ExternalApiQuotaService } from "../../common/services/external-api-quota.service";
import { RedisModule } from "../../common/redis/modules/redis.module";

@Module({
  imports: [ExternalModule, RedisModule, CacheModule],
  controllers: [PlayersController],
  providers: [PlayersService, ExternalApiQuotaService]
})

export class PlayersModule {}
