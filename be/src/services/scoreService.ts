import { Op } from "sequelize";
import { Student, Subject, Score } from "../models";
import {
  calculateTotalScore,
  calculateScoreByGroup,
} from "./subjectGroupService";

interface StudentScore {
  registrationNumber: string;
  subjectScores: Record<string, number>;
  groupId: string | null;
  groupName: string | null;
  totalScore: number;
}

export const getScoreByRegistrationNumberService = async (
  registrationNumber: string
) => {
  const student = await Student.findOne({
    where: { registrationNumber },
  });

  if (!student) {
    return null;
  }

  const scores = await Score.findAll({
    where: { studentId: student.id },
    include: [
      {
        model: Subject,
        as: "subject",
        attributes: ["name", "code"],
      },
    ],
  });

  if (!scores || scores.length === 0) {
    return null;
  }

  const scoresBySubject: Record<string, number> = {};
  scores.forEach((score) => {
    const subject = score.get("subject") as any;
    scoresBySubject[subject.code] = score.score;
  });

  const { groupId, groupName, totalScore } = await calculateTotalScore(
    scoresBySubject
  );

  return {
    registrationNumber: student.registrationNumber,
    ...scoresBySubject,
    groupId,
    groupName,
    totalScore,
  };
};

export const getScoreByGroupService = async (
  registrationNumber: string,
  groupId: string
) => {
  const student = await Student.findOne({
    where: { registrationNumber },
  });

  if (!student) {
    return null;
  }

  const scores = await Score.findAll({
    where: { studentId: student.id },
    include: [
      {
        model: Subject,
        as: "subject",
        attributes: ["name", "code"],
      },
    ],
  });

  if (!scores || scores.length === 0) {
    return null;
  }

  const scoresBySubject: Record<string, number> = {};
  scores.forEach((score) => {
    const subject = score.get("subject") as any;
    scoresBySubject[subject.code] = score.score;
  });

  const result = await calculateScoreByGroup(scoresBySubject, groupId);

  if (!result) {
    return null;
  }

  return {
    registrationNumber: student.registrationNumber,
    ...scoresBySubject,
    groupId: result.groupId,
    groupName: result.groupName,
    totalScore: result.totalScore,
  };
};

export const getStatisticsService = async () => {
  const subjectsData = await Subject.findAll();
  const subjectCodes = subjectsData.map((subject) => subject.get("code"));

  const statistics = [];

  for (const subjectCode of subjectCodes) {
    const subject = subjectsData.find((s) => s.get("code") === subjectCode);
    if (!subject) continue;

    const gte8Count = await Score.count({
      where: {
        subjectId: subject.id,
        score: { [Op.gte]: 8 },
      },
    });

    const from6To8Count = await Score.count({
      where: {
        subjectId: subject.id,
        score: { [Op.gte]: 6, [Op.lt]: 8 },
      },
    });

    const from4To6Count = await Score.count({
      where: {
        subjectId: subject.id,
        score: { [Op.gte]: 4, [Op.lt]: 6 },
      },
    });

    const lessThan4Count = await Score.count({
      where: {
        subjectId: subject.id,
        score: { [Op.lt]: 4 },
      },
    });

    statistics.push({
      subject: subject.get("name"),
      subjectCode,
      greaterThanOrEqual8: gte8Count,
      from6To8: from6To8Count,
      from4To6: from4To6Count,
      lessThan4: lessThan4Count,
    });
  }

  return statistics;
};

export const getTop10StudentsGroupAService = async () => {
  const studentsWithAllScores = await Student.findAll({
    include: [
      {
        model: Score,
        as: "scores",
        required: true,
        include: [{ model: Subject, as: "subject" }],
      },
    ],
  });

  const studentScores = await Promise.all(
    studentsWithAllScores.map(async (student) => {
      const scores = student.get("scores") as any[];
      const scoresBySubject: Record<string, number> = {};

      scores.forEach((scoreObj) => {
        const subject = scoreObj.subject;
        if (subject && subject.code) {
          scoresBySubject[subject.code] = scoreObj.score;
        }
      });

      if (Object.keys(scoresBySubject).length > 0) {
        const { groupId, groupName, totalScore } = await calculateTotalScore(
          scoresBySubject
        );

        return {
          registrationNumber: student.registrationNumber,
          subjectScores: scoresBySubject,
          groupId,
          groupName,
          totalScore,
        } as StudentScore;
      }
      return null;
    })
  );

  const filteredScores = studentScores.filter(
    (score): score is StudentScore =>
      score !== null &&
      (score.groupId === "A" ||
        (score.subjectScores["toan"] !== undefined &&
          score.subjectScores["vat_li"] !== undefined &&
          score.subjectScores["hoa_hoc"] !== undefined))
  );
  return filteredScores
    .sort((a, b) => b.totalScore - a.totalScore)
    .slice(0, 10)
    .map((score) => ({
      registrationNumber: score.registrationNumber,
      ...score.subjectScores,
      groupId: score.groupId,
      groupName: score.groupName,
      totalScore: score.totalScore,
    }));
};
