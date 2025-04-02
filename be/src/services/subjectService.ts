import Subject, { createSubject, getSubjectInstance } from "../models/subject";
import { ISubject } from "../interfaces";

export interface ISubjectWithContribution extends ISubject {
  calculateContribution(score: number): number;
}

export class SubjectService {
  async getAllSubjects(): Promise<ISubject[]> {
    return await Subject.findAll();
  }

  async getSubjectById(id: number): Promise<ISubjectWithContribution | null> {
    const subject = await getSubjectInstance(id);
    return subject as ISubjectWithContribution | null;
  }

  async getSubjectByCode(
    code: string
  ): Promise<ISubjectWithContribution | null> {
    const subject = await getSubjectInstance(code);
    return subject as ISubjectWithContribution | null;
  }

  async getSubjectsByGroup(groupId: number): Promise<ISubject[]> {
    return await Subject.findAll({
      where: { groupId },
    });
  }

  async getSubjectsByGroupCode(groupCode: string): Promise<ISubject[]> {
    const subjects = await Subject.findAll({
      include: [
        {
          association: "group",
          where: { code: groupCode },
        },
      ],
    });

    return subjects;
  }

  async calculateTotalScore(
    studentScores: Record<string, number>
  ): Promise<number> {
    let totalScore = 0;

    for (const [subjectCode, score] of Object.entries(studentScores)) {
      const subject = await this.getSubjectByCode(subjectCode);
      if (subject) {
        totalScore += subject.calculateContribution(score);
      }
    }

    return totalScore;
  }

  async calculateGroupScore(
    studentScores: Record<string, number>,
    groupCode: string
  ): Promise<number> {
    const groupSubjects = await this.getSubjectsByGroupCode(groupCode);
    const groupSubjectCodes = groupSubjects.map((subject) => subject.code);

    let totalScore = 0;

    const hasAllRequiredSubjects = groupSubjectCodes.every(
      (code) => studentScores[code] !== undefined
    );

    if (!hasAllRequiredSubjects) {
      return 0;
    }

    for (const code of groupSubjectCodes) {
      const subject = await this.getSubjectByCode(code);
      if (subject && studentScores[code] !== undefined) {
        totalScore += subject.calculateContribution(studentScores[code]);
      }
    }

    return totalScore;
  }

  createSubjectInstance(data: any): ISubjectWithContribution {
    return createSubject(data) as ISubjectWithContribution;
  }
}

export const subjectService = new SubjectService();
