import { SubjectGroup, Subject } from "../models";
import { subjectService } from "./subjectService";

interface TotalScoreResult {
  groupId: string | null;
  groupName: string | null;
  totalScore: number;
}

export class SubjectGroupService {
  async calculateScoreByGroup(
    subjectScores: Record<string, number>,
    groupId: string
  ): Promise<TotalScoreResult | null> {
    const group = await SubjectGroup.findOne({
      where: { code: groupId },
      include: [
        {
          model: Subject,
          as: "subjects",
          attributes: ["code"],
        },
      ],
    });

    if (!group) {
      return null;
    }

    const groupSubjects = group.get("subjects") as any[];
    const groupSubjectCodes = groupSubjects.map((subject) => subject.code);

    const hasAllRequiredSubjects = groupSubjectCodes.every(
      (code) => subjectScores[code] !== undefined
    );

    if (!hasAllRequiredSubjects) {
      return null;
    }

    const totalScore = await subjectService.calculateGroupScore(
      subjectScores,
      groupId
    );

    return {
      groupId: group.get("code"),
      groupName: group.get("name"),
      totalScore,
    };
  }

  async getSubjectsByGroupCode(groupCode: string) {
    return await subjectService.getSubjectsByGroupCode(groupCode);
  }
}

export const subjectGroupService = new SubjectGroupService();
