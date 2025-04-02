import { Model, DataTypes } from "sequelize";
import { sequelize } from "../config/database";
import { IScore } from "../interfaces";

class Score extends Model<IScore> implements IScore {
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
      validate: {
        min: 0,
        max: 10,
      },
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
    timestamps: true,
  }
);

export default Score;
