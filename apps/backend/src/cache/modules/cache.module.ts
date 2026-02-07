import { Module, Global } from '@nestjs/common';
import { CacheService } from '../services/cache.service';
import { RedisModule } from '../../common/redis/modules/redis.module';

@Global()
@Module({
  imports: [RedisModule],
  providers: [CacheService],
  exports: [CacheService],
})

export class CacheModule {}
