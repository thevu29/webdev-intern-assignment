"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const scoreController_1 = require("../controllers/scoreController");
const router = (0, express_1.Router)();
router.get("/", scoreController_1.getScoreByRegistrationNumber);
router.get("/statistics", scoreController_1.getStatistics);
router.get("/top-10-A", scoreController_1.getTop10StudentsGroupA);
exports.default = router;
