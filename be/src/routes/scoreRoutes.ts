import { Router } from "express";
import { scoreController } from "../controllers/scoreController";

const router = Router();

router.get(
  "/",
  scoreController.getScoreByRegistrationNumber.bind(scoreController)
);
router.get("/statistics", scoreController.getStatistics.bind(scoreController));
router.get(
  "/top-students/:groupCode",
  scoreController.getTopStudentsByGroup.bind(scoreController)
);

export default router;
