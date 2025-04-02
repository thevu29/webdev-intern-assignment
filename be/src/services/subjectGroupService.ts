import { SubjectGroup, Subject } from "../models";

interface TotalScoreResult {
  groupId: string | null;
  groupName: string | null;
  totalScore: number;
}

export const calculateTotalScore = async (
  subjectScores: Record<string, number>
): Promise<TotalScoreResult> => {
  // Default return with no group match
  let result: TotalScoreResult = {
    groupId: null,
    groupName: null,
    totalScore: 0,
  };

  // Get all subject groups from the database
  const subjectGroups = await SubjectGroup.findAll({
    include: [
      {
        model: Subject,
        as: "subjects",
        attributes: ["code"],
      },
    ],
  });

  // Check each group to see if the student's scores match any group
  for (const group of subjectGroups) {
    const groupSubjects = group.get("subjects") as any[];
    const groupSubjectCodes = groupSubjects.map((subject) => subject.code);

    // Check if the student has scores for all subjects in this group
    const hasAllRequiredSubjects = groupSubjectCodes.every(
      (code) => subjectScores[code] !== undefined
    );

    if (hasAllRequiredSubjects) {
      // Calculate total score for this group
      let totalScore = 0;
      for (const code of groupSubjectCodes) {
        totalScore += subjectScores[code];
      }

      // Update result if we found a matching group
      result = {
        groupId: group.get("code"),
        groupName: group.get("name"),
        totalScore,
      };

      // Since we found a matching group, no need to check others
      break;
    }
  }

  return result;
};

// New function to calculate scores by group
export const calculateScoreByGroup = async (
  subjectScores: Record<string, number>,
  groupId: string
): Promise<TotalScoreResult | null> => {
  // Find the specific group
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

  // Check if the student has scores for all subjects in this group
  const hasAllRequiredSubjects = groupSubjectCodes.every(
    (code) => subjectScores[code] !== undefined
  );

  if (!hasAllRequiredSubjects) {
    return null;
  }

  // Calculate total score for this group
  let totalScore = 0;
  for (const code of groupSubjectCodes) {
    totalScore += subjectScores[code];
  }

  return {
    groupId: group.get("code"),
    groupName: group.get("name"),
    totalScore,
  };
};
