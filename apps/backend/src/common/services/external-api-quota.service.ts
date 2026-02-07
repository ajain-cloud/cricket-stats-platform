import { Injectable } from "@nestjs/common";
import { RedisService } from "../redis/services/redis.service";

@Injectable()
export class ExternalApiQuotaService {
  private readonly DAILY_LIMIT = 1;

  constructor(private readonly redisService: RedisService) {}

  private getTodayKey(): string {
    const today = new Date().toISOString().split('T')[0];
    return `cricapi:quota:${today}`;
  }

  async canCall(): Promise<boolean> {
    const client = this.redisService.getClient();
    const count = await client.get(this.getTodayKey());
    return Number(count ?? 0) < this.DAILY_LIMIT;
  }

  async increment(): Promise<void> {
    const client = this.redisService.getClient();
    const key = this.getTodayKey();

    const count = await client.incr(key);

    // Set expiry only on first increment
    if (count === 1) {
      const secondsUntilMidnight =
        Math.floor(
          (new Date().setHours(24, 0, 0, 0) - Date.now()) / 1000
        );

      await client.expire(key, secondsUntilMidnight);
    }
  }

  async getUsage() {
    const client = this.redisService.getClient();
    const used = Number(await client.get(this.getTodayKey())) || 0;

    return {
      used,
      limit: this.DAILY_LIMIT,
    };
  }
}
