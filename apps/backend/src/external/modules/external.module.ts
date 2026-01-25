import { Module } from "@nestjs/common";
import { CricketApiService } from "../services/cricket-api.service";

@Module({
  providers: [CricketApiService],
  exports: [CricketApiService]
})

export class ExternalModule {}
