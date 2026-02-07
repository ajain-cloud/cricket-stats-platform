import { Controller, Get } from "@nestjs/common";
import { ExternalApiQuotaService } from "../../common/services/external-api-quota.service";

@Controller('quota')
export class QuotaController {
  constructor(private readonly quotaService: ExternalApiQuotaService) {}

  @Get('status')
  async getQuotaStatus() { 
    return this.quotaService.getUsage();
  }
}
