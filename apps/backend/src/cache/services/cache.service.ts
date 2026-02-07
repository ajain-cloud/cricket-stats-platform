import { Injectable } from "@nestjs/common";
import { RedisService } from "../../common/redis/services/redis.service";

@Injectable()
export class CacheService {
  constructor(private readonly redisService: RedisService) {}

  async get<T>(key: string): Promise<T | null> {
    const value = await this.redisService.getClient().get(key);
    return value ? (JSON.parse(value) as T) : null;
  }

  async set(key: string, value: any): Promise<void> {
    await this.redisService.getClient().set(key, JSON.stringify(value));
  }
}
