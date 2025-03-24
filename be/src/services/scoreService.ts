import { Op } from "sequelize";
import Score from "../models/score";
import Student from "../models/student";
import Subject from "../models/subject";

interface StudentScore {
  sbd: string;
  toan: number;
  vat_li: number;
  hoa_hoc: number;
  tong_diem: number;
}

export const getScoreByRegistrationNumberService = async (
  registrationNumber: string
) => {
  const student = await Student.findOne({
    where: { sbd: registrationNumber },
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
        attributes: ["name"],
      },
    ],
  });

  if (!scores || scores.length === 0) {
    return null;
  }

  const scoresBySubject: Record<string, number> = {};
  scores.forEach((score) => {
    const subjectName = (score.get("subject") as any).name;
    scoresBySubject[subjectName] = score.score;
  });

  return {
    sbd: student.sbd,
    ...scoresBySubject,
  };
};

export const getStatisticsService = async () => {
  const subjectsData = await Subject.findAll();
  const subjectNames = subjectsData.map((subject) => subject.name);

  const statistics = [];

  for (const subjectName of subjectNames) {
    const subject = subjectsData.find((s) => s.name === subjectName);
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
      subject: subjectName,
      greaterThanOrEqual8: gte8Count,
      from6To8: from6To8Count,
      from4To6: from4To6Count,
      lessThan4: lessThan4Count,
    });
  }

  return statistics;
};

export const getTop10StudentsGroupAService = async () => {
  const [toanSubject, vatLiSubject, hoaHocSubject] = await Promise.all([
    Subject.findOne({ where: { name: "toan" } }),
    Subject.findOne({ where: { name: "vat_li" } }),
    Subject.findOne({ where: { name: "hoa_hoc" } }),
  ]);

  if (!toanSubject || !vatLiSubject || !hoaHocSubject) {
    throw new Error("Required subjects not found");
  }

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

  const studentScores = studentsWithAllScores
    .map((student) => {
      const scores = student.get("scores") as any[];
      const toanScore =
        scores.find((s) => s.subjectId === toanSubject.id)?.score || 0;
      const vatLiScore =
        scores.find((s) => s.subjectId === vatLiSubject.id)?.score || 0;
      const hoaHocScore =
        scores.find((s) => s.subjectId === hoaHocSubject.id)?.score || 0;

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
    .filter((score): score is StudentScore => score !== null);

  return studentScores.sort((a, b) => b.tong_diem - a.tong_diem).slice(0, 10);
};
