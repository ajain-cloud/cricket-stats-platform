import { Injectable, HttpException } from "@nestjs/common";
import axios from "axios";

@Injectable()
export class CricketApiService {
  private readonly baseUrl = process.env.CRIC_API_BASE_URL;
  private readonly apiKey = process.env.CRIC_API_KEY;

  async searchPlayer(name: string) {
    try {
      const response = await axios.get(`${this.baseUrl}/players`, {
        params: {
          search: name,
          apikey: this.apiKey,
        }
      });

      return response.data;
    } catch (error) {
      console.error(error.response?.data || error.message);
      throw new HttpException('Failed to fetch players', 502);
    }
  }

  async getPlayerDetails(playerId: string) {
    try {
      const response = await axios.get(`${this.baseUrl}/players_info`, {
        params: {
          id: playerId,
          apiKey: this.apiKey
        }
      });

      return response.data;
    } catch (error) {
      console.error(error.response?.data || error.message);
      throw new HttpException('Failed to fetch players', 502);
    }
  }
}
