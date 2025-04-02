"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTop10StudentsGroupA = exports.getStatistics = exports.getScoreByRegistrationNumber = void 0;
const scoreService_1 = require("../services/scoreService");
const getScoreByRegistrationNumber = async (req, res) => {
    try {
        const registrationNumber = req.query.registration_number;
        if (!registrationNumber) {
            return res
                .status(400)
                .json({ success: false, message: "Registration number is required" });
        }
        const score = await (0, scoreService_1.getScoreByRegistrationNumberService)(registrationNumber);
        if (!score) {
            return res
                .status(404)
                .json({ success: false, message: "Registration number not found" });
        }
        return res.status(200).json({
            success: true,
            score,
        });
    }
    catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({ success: false, message: "Internal server error" });
    }
};
exports.getScoreByRegistrationNumber = getScoreByRegistrationNumber;
const getStatistics = async (req, res) => {
    try {
        const statistics = await (0, scoreService_1.getStatisticsService)();
        return res.status(200).json({
            success: true,
            statistics,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
exports.getStatistics = getStatistics;
const getTop10StudentsGroupA = async (req, res) => {
    try {
        const topStudents = await (0, scoreService_1.getTop10StudentsGroupAService)();
        return res.status(200).json({
            success: true,
            topStudents,
        });
    }
    catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({ success: false, message: "Internal server error" });
    }
};
exports.getTop10StudentsGroupA = getTop10StudentsGroupA;
