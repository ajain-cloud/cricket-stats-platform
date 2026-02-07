import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { ThrottlerIpGuard } from './common/guards/throttler-ip.guard';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PlayersModule } from './players/modules/players.module';
import { ExternalApiQuotaService } from './common/services/external-api-quota.service';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60,
          limit: 1
        }
      ],
    }),
    PlayersModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    ExternalApiQuotaService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerIpGuard,
    },
  ],
})
export class AppModule {}
