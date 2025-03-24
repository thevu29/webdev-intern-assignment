import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database";
import Score from "./score";

interface StudentAttributes {
  id: number;
  sbd: string;
}

class Student extends Model<StudentAttributes> implements StudentAttributes {
  public id!: number;
  public sbd!: string;
}

Student.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    sbd: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
  },
  {
    tableName: "students",
    sequelize,
  }
);

Student.hasMany(Score, {
  foreignKey: "studentId",
  as: "scores",
});

export default Student;
