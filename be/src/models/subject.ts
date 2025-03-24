import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database";
import Score from "./score";

interface SubjectAttributes {
  id: number;
  name: string;
}

class Subject extends Model<SubjectAttributes> implements SubjectAttributes {
  public id!: number;
  public name!: string;
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
  },
  {
    tableName: "subjects",
    sequelize,
  }
);

Subject.hasMany(Score, {
  foreignKey: "subjectId",
  as: "scores",
});

export default Subject;
