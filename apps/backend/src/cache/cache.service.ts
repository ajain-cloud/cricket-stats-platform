import { Injectable } from "@nestjs/common";

@Injectable()
export class CacheService {
  private cache = new Map<string, any>();

  get<T>(key: string): T | undefined {
    return this.cache.get(key);
  }

  set(key: string, value: any) {
    return this.cache.set(key, value);
  }
}
