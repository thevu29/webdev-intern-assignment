import { Model, DataTypes } from "sequelize";
import { sequelize } from "../config/database";

interface ScoreAttributes {
  id: number;
  sbd: string;
  toan: number | null;
  ngu_van: number | null;
  ngoai_ngu: number | null;
  vat_li: number | null;
  hoa_hoc: number | null;
  sinh_hoc: number | null;
  lich_su: number | null;
  dia_li: number | null;
  gdcd: number | null;
  ma_ngoai_ngu: string | null;
}

class Score extends Model<ScoreAttributes> implements ScoreAttributes {
  public id!: number;
  public sbd!: string;
  public toan!: number | null;
  public ngu_van!: number | null;
  public ngoai_ngu!: number | null;
  public vat_li!: number | null;
  public hoa_hoc!: number | null;
  public sinh_hoc!: number | null;
  public lich_su!: number | null;
  public dia_li!: number | null;
  public gdcd!: number | null;
  public ma_ngoai_ngu!: string | null;
}

Score.init(
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
    toan: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    ngu_van: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    ngoai_ngu: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    vat_li: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    hoa_hoc: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    sinh_hoc: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    lich_su: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    dia_li: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    gdcd: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    ma_ngoai_ngu: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "score",
    tableName: "scores",
    indexes: [
      {
        fields: ["sbd"],
      },
      {
        fields: ["toan"],
      },
      {
        fields: ["ngu_van"],
      },
      {
        fields: ["ngoai_ngu"],
      },
      {
        fields: ["vat_li"],
      },
      {
        fields: ["hoa_hoc"],
      },
      {
        fields: ["sinh_hoc"],
      },
      {
        fields: ["lich_su"],
      },
      {
        fields: ["dia_li"],
      },
      {
        fields: ["gdcd"],
      },
      {
        name: "idx_subjects",
        fields: [
          "toan",
          "ngu_van",
          "ngoai_ngu",
          "vat_li",
          "hoa_hoc",
          "sinh_hoc",
          "lich_su",
          "dia_li",
          "gdcd",
        ],
      },
    ],
  }
);

export default Score;
