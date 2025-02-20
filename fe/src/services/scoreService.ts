import { ScoreResponse } from "../types/types";
import axios from "../utils/axiosCustom";

export const searchScoresService = async (
  registration_number: string
): Promise<ScoreResponse> => {
  return await axios.get(`/scores?registration_number=${registration_number}`);
};
