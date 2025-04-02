import { Request, Response } from "express";
import { scoreService } from "../services/scoreService";

export class ScoreController {
  async getScoreByRegistrationNumber(
    req: Request,
    res: Response
  ): Promise<any> {
    try {
      const registrationNumber = req.query.registration_number as string;

      if (!registrationNumber) {
        return res
          .status(400)
          .json({ success: false, message: "Registration number is required" });
      }

      const score = await scoreService.getScoreByRegistrationNumber(
        registrationNumber
      );

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
  }

  async getStatistics(req: Request, res: Response): Promise<any> {
    try {
      const statistics = await scoreService.getStatistics();

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
  }

  async getTopStudentsByGroup(req: Request, res: Response): Promise<any> {
    try {
      const groupCode = req.params.groupCode;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;

      if (!groupCode) {
        return res
          .status(400)
          .json({ success: false, message: "Group code is required" });
      }

      const topStudents = await scoreService.getTopStudentsByGroup(
        groupCode,
        limit
      );

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
  }
}

export const scoreController = new ScoreController();
