import { Injectable } from "@nestjs/common";

@Injectable()
export class ExternalApiQuotaService {
  private count = 0;
  private lastReset = this.today();

  private readonly DAILY_LIMIT = 30;

  private today(): string {
    return new Date().toISOString().split('T')[0];
  }

  private resetIfNewDay() {
    const today = this.today();
    if (this.lastReset !== today) {
      this.count = 0;
      this.lastReset = today;
    }
  }

  canCall(): boolean {
    this.resetIfNewDay();
    return this.count < this.DAILY_LIMIT;
  }

  increment() {
    this.resetIfNewDay();
    this.count++;
  }

  getUsage() {
    this.resetIfNewDay();
    return {
      used: this.count,
      limit: this.DAILY_LIMIT,
    };
  }
}
