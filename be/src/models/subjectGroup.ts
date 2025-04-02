import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database";
import { ISubjectGroup } from "../interfaces";

class SubjectGroup extends Model<ISubjectGroup> implements ISubjectGroup {
  public id!: number;
  public name!: string;
  public code!: string;

  public get subjects(): string[] {
    return this._subjects || [];
  }

  public set subjects(values: string[]) {
    this._subjects = values;
  }

  private _subjects?: string[];
}

SubjectGroup.init(
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
      type: DataTypes.STRING(1),
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize,
    tableName: "subject_groups",
    timestamps: true,
  }
);

export default SubjectGroup;
