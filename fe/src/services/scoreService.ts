import { ScoreResponse, StatisticsResponse, Top10StudentsGroupAResponse } from "../types/types";
import axios from "../utils/axiosCustom";

export const searchScoresService = async (
  registration_number: string
): Promise<ScoreResponse> => {
  return await axios.get(`/scores?registration_number=${registration_number}`);
};

export const getStatisticsService = async (): Promise<StatisticsResponse> => {
  return await axios.get("/scores/statistics");
};

export const getTop10StudentsGroupAService = async (): Promise<Top10StudentsGroupAResponse> => {
  return await axios.get("/scores/top-10-A");
};
