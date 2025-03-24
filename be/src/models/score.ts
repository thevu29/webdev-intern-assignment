import { Model, DataTypes } from "sequelize";
import { sequelize } from "../config/database";
import Student from "./student";
import Subject from "./subject";

interface ScoreAttributes {
  id: number;
  studentId: number;
  subjectId: number;
  score: number;
}

class Score extends Model<ScoreAttributes> implements ScoreAttributes {
  public id!: number;
  public studentId!: number;
  public subjectId!: number;
  public score!: number;
}

Score.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    studentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "students",
        key: "id",
      },
    },
    subjectId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "subjects",
        key: "id",
      },
    },
    score: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "score",
    tableName: "scores",
    indexes: [
      {
        fields: ["studentId"],
      },
      {
        fields: ["subjectId"],
      },
      {
        name: "idx_student_subject",
        fields: ["studentId", "subjectId"],
        unique: true,
      },
    ],
  }
);

Score.belongsTo(Student, {
  foreignKey: "studentId",
  as: "student",
});

Score.belongsTo(Subject, {
  foreignKey: "subjectId",
  as: "subject",
});

export default Score;
