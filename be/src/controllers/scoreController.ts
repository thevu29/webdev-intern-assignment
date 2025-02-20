import { Request, Response } from "express";
import {
  getScoreByRegistrationNumberService,
  getStatisticsService,
  getTop10StudentsGroupAService,
} from "../services/scoreService";

export const getScoreByRegistrationNumber = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const registrationNumber = req.query.registration_number as string;

    if (!registrationNumber) {
      return res
        .status(400)
        .json({ success: false, message: "Registration number is required" });
    }

    const score = await getScoreByRegistrationNumberService(registrationNumber);

    if (!score) {
      return res
        .status(404)
        .json({ success: false, message: "Registration number not found" });
    }

    return res.status(200).json({
      success: true,
      score,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const getStatistics = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const statistics = await getStatisticsService();

    return res.status(200).json({
      success: true,
      statistics,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getTop10StudentsGroupA = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const topStudents = await getTop10StudentsGroupAService();

    return res.status(200).json({
      success: true,
      topStudents,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
