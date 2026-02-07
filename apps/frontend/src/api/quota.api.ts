import { axiosApi } from "./axios";

export const getQuotaStatus = async (): Promise<any> => {
  const res = await axiosApi.get('/quota/status');
  return res.data as { used: number; limit: number };
};
