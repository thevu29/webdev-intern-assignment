import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database";
import { ISubject } from "../interfaces";

export interface ISubjectCalculator {
  calculateContribution(score: number): number;
}

class Subject extends Model<ISubject> implements ISubject, ISubjectCalculator {
  public id!: number;
  public name!: string;
  public code!: string;
  public groupId?: number;

  calculateContribution(score: number): number {
    return score;
  }
}

Subject.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    groupId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "subject_groups",
        key: "id",
      },
    },
  },
  {
    sequelize,
    tableName: "subjects",
    timestamps: true,
  }
);

export class MathSubject extends Subject {
  calculateContribution(score: number): number {
    return score;
  }
}

export class PhysicsSubject extends Subject {
  calculateContribution(score: number): number {
    return score;
  }
}

export class ChemistrySubject extends Subject {
  calculateContribution(score: number): number {
    return score;
  }
}

export class BiologySubject extends Subject {
  calculateContribution(score: number): number {
    return score;
  }
}

export class LiteratureSubject extends Subject {
  calculateContribution(score: number): number {
    return score;
  }
}

export class HistorySubject extends Subject {
  calculateContribution(score: number): number {
    return score;
  }
}

export class GeographySubject extends Subject {
  calculateContribution(score: number): number {
    return score;
  }
}

export class CivicEducationSubject extends Subject {
  calculateContribution(score: number): number {
    return score;
  }
}

export class ForeignLanguage extends Subject {
  calculateContribution(score: number): number {
    return score;
  }
}

export const createSubject = (data: any): Subject => {
  const { code } = data;
  switch (code) {
    case "toan":
      return new MathSubject(data);
    case "vat_li":
      return new PhysicsSubject(data);
    case "hoa_hoc":
      return new ChemistrySubject(data);
    case "sinh_hoc":
      return new BiologySubject(data);
    case "ngu_van":
      return new LiteratureSubject(data);
    case "lich_su":
      return new HistorySubject(data);
    case "dia_li":
      return new GeographySubject(data);
    case "gdcd":
      return new CivicEducationSubject(data);
    case "ngoai_ngu":
      return new ForeignLanguage(data);
    default:
      return new Subject(data);
  }
};

export const getSubjectInstance = async (
  identifier: number | string
): Promise<Subject | null> => {
  let subject;
  if (typeof identifier === "number") {
    subject = await Subject.findByPk(identifier);
  } else {
    subject = await Subject.findOne({ where: { code: identifier } });
  }

  if (!subject) return null;

  return createSubject(subject.get());
};

export default Subject;
