import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database";
import { IStudent } from "../interfaces";

class Student extends Model<IStudent> implements IStudent {
  public id!: number;
  public registrationNumber!: string;
}

Student.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    registrationNumber: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "students",
    timestamps: true,
  }
);

export default Student;
