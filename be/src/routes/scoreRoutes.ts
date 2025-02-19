import { Router } from "express";
import { getScoreByRegistrationNumber, getStatistics, getTop10StudentsGroupA } from "../controllers/scoreController";

const router = Router();

router.get("/", getScoreByRegistrationNumber);
router.get("/statistics", getStatistics);
router.get("/top-10-A", getTop10StudentsGroupA);

export default router;
