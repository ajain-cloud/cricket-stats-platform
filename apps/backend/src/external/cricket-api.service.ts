import axios from "axios";

@Injectable()
export class CricketApiService {
  private readonly baseUrl = process.env.CRIC_API_BASE_URL;
  private readonly apiKey = process.env.CRIC_API_KEY;

  async searchPlayer(name: string) {
    return axios.get(`${this.baseUrl}/players`, {
      params: { search: name, apiKey: this.apiKey }
    });
  }

  async getPlayerStats(playerId: string) {
    return axios.get(`${this.baseUrl}/player_stats`, {
      params: { id: playerId, apiKey: this.apiKey }
    });
  }
}