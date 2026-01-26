import { axiosApi } from "./axios";

import type { PlayerSearchItem, PlayerAggregateResponse } from "../types/player.types";

export const searchPlayers = async (search: string): Promise<PlayerSearchItem[]> => {
  const res = await axiosApi.get('/players/search', {
    params: { search }
  });

  return res.data;
};

export const getPlayerById = async (id: string): Promise<PlayerAggregateResponse> => {
  const res = await axiosApi.get(`/players/${id}`);
  return res.data;
};
