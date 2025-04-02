"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTop10StudentsGroupAService = exports.getStatisticsService = exports.getScoreByRegistrationNumberService = void 0;
const sequelize_1 = require("sequelize");
const models_1 = require("../models");
const getScoreByRegistrationNumberService = async (registrationNumber) => {
    const student = await models_1.Student.findOne({
        where: { sbd: registrationNumber },
    });
    if (!student) {
        return null;
    }
    const scores = await models_1.Score.findAll({
        where: { studentId: student.id },
        include: [
            {
                model: models_1.Subject,
                as: "subject",
                attributes: ["name"],
            },
        ],
    });
    if (!scores || scores.length === 0) {
        return null;
    }
    const scoresBySubject = {};
    scores.forEach((score) => {
        const subjectName = score.get("subject").name;
        scoresBySubject[subjectName] = score.score;
    });
    return {
        sbd: student.sbd,
        ...scoresBySubject,
    };
};
exports.getScoreByRegistrationNumberService = getScoreByRegistrationNumberService;
const getStatisticsService = async () => {
    const subjectsData = await models_1.Subject.findAll();
    const subjectNames = subjectsData.map((subject) => subject.name);
    const statistics = [];
    for (const subjectName of subjectNames) {
        const subject = subjectsData.find((s) => s.name === subjectName);
        if (!subject)
            continue;
        const gte8Count = await models_1.Score.count({
            where: {
                subjectId: subject.id,
                score: { [sequelize_1.Op.gte]: 8 },
            },
        });
        const from6To8Count = await models_1.Score.count({
            where: {
                subjectId: subject.id,
                score: { [sequelize_1.Op.gte]: 6, [sequelize_1.Op.lt]: 8 },
            },
        });
        const from4To6Count = await models_1.Score.count({
            where: {
                subjectId: subject.id,
                score: { [sequelize_1.Op.gte]: 4, [sequelize_1.Op.lt]: 6 },
            },
        });
        const lessThan4Count = await models_1.Score.count({
            where: {
                subjectId: subject.id,
                score: { [sequelize_1.Op.lt]: 4 },
            },
        });
        statistics.push({
            subject: subjectName,
            greaterThanOrEqual8: gte8Count,
            from6To8: from6To8Count,
            from4To6: from4To6Count,
            lessThan4: lessThan4Count,
        });
    }
    return statistics;
};
exports.getStatisticsService = getStatisticsService;
const getTop10StudentsGroupAService = async () => {
    const [toanSubject, vatLiSubject, hoaHocSubject] = await Promise.all([
        models_1.Subject.findOne({ where: { name: "toan" } }),
        models_1.Subject.findOne({ where: { name: "vat_li" } }),
        models_1.Subject.findOne({ where: { name: "hoa_hoc" } }),
    ]);
    if (!toanSubject || !vatLiSubject || !hoaHocSubject) {
        throw new Error("Required subjects not found");
    }
    const studentsWithAllScores = await models_1.Student.findAll({
        include: [
            {
                model: models_1.Score,
                as: "scores",
                required: true,
                include: [{ model: models_1.Subject, as: "subject" }],
            },
        ],
    });
    const studentScores = studentsWithAllScores
        .map((student) => {
        var _a, _b, _c;
        const scores = student.get("scores");
        const toanScore = ((_a = scores.find((s) => s.subjectId === toanSubject.id)) === null || _a === void 0 ? void 0 : _a.score) || 0;
        const vatLiScore = ((_b = scores.find((s) => s.subjectId === vatLiSubject.id)) === null || _b === void 0 ? void 0 : _b.score) || 0;
        const hoaHocScore = ((_c = scores.find((s) => s.subjectId === hoaHocSubject.id)) === null || _c === void 0 ? void 0 : _c.score) || 0;
        if (toanScore && vatLiScore && hoaHocScore) {
            return {
                sbd: student.sbd,
                toan: toanScore,
                vat_li: vatLiScore,
                hoa_hoc: hoaHocScore,
                tong_diem: toanScore + vatLiScore + hoaHocScore,
            };
        }
        return null;
    })
        .filter((score) => score !== null);
    return studentScores.sort((a, b) => b.tong_diem - a.tong_diem).slice(0, 10);
};
exports.getTop10StudentsGroupAService = getTop10StudentsGroupAService;
