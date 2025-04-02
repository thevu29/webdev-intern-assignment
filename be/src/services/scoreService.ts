import { Op } from "sequelize";
import { Student, Subject, Score, SubjectGroup } from "../models";
import { subjectService } from "./subjectService";

interface StudentScore {
  registrationNumber: string;
  subjectScores: Record<string, number>;
  groupId: string | null;
  groupName: string | null;
  totalScore: number;
}

export class ScoreService {
  async getScoreByRegistrationNumber(registrationNumber: string) {
    const student = await Student.findOne({
      where: { registrationNumber },
    });

    if (!student) {
      return null;
    }

    const allSubjects = await Subject.findAll();

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

    const scoresBySubject: Record<string, number | null> = {};
    allSubjects.forEach((subject) => {
      scoresBySubject[subject.code] = null;
    });

    scores.forEach((score) => {
      const subject = score.get("subject") as any;
      scoresBySubject[subject.code] = score.score;
    });

    return {
      registrationNumber: student.registrationNumber,
      ...scoresBySubject,
    };
  }

  async getScoreByGroup(registrationNumber: string, groupId: string) {
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

    const groupInfo = await SubjectGroup.findOne({
      where: { code: groupId },
    });

    if (!groupInfo) {
      return null;
    }

    const groupScore = await subjectService.calculateGroupScore(
      scoresBySubject,
      groupId
    );

    if (groupScore === 0) {
      return null;
    }

    return {
      registrationNumber: student.registrationNumber,
      ...scoresBySubject,
      groupId: groupInfo.code,
      groupName: groupInfo.name,
      totalScore: groupScore,
    };
  }

  async getStatistics() {
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
  }

  async getTopStudentsByGroup(groupCode: string, limit: number = 10) {
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

    // Lấy thông tin group trước
    const groupInfo = await SubjectGroup.findOne({
      where: { code: groupCode },
    });

    if (!groupInfo) {
      return [];
    }

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

        // Sử dụng subjectService để tính điểm
        const groupScore = await subjectService.calculateGroupScore(
          scoresBySubject,
          groupCode
        );

        if (groupScore > 0) {
          return {
            registrationNumber: student.registrationNumber,
            subjectScores: scoresBySubject,
            groupId: groupInfo.code,
            groupName: groupInfo.name,
            totalScore: groupScore,
          } as StudentScore;
        }

        return null;
      })
    );

    const filteredScores = studentScores.filter(
      (score): score is StudentScore => score !== null
    );

    return filteredScores
      .sort((a, b) => b.totalScore - a.totalScore)
      .slice(0, limit)
      .map((score) => ({
        registrationNumber: score.registrationNumber,
        ...score.subjectScores,
        groupId: score.groupId,
        groupName: score.groupName,
        totalScore: score.totalScore,
      }));
  }

  async getTop10StudentsGroupA() {
    return this.getTopStudentsByGroup("A");
  }
}

export const scoreService = new ScoreService();
