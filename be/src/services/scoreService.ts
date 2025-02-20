import { literal, Op, Sequelize } from "sequelize";
import Score from "../models/score";

export const getScoreByRegistrationNumberService = async (
  registrationNumber: string
) => {
  const score = await Score.findOne({
    where: { sbd: registrationNumber },
  });
  return score;
};

export const getStatisticsService = async () => {
  const subjects = [
    "toan",
    "ngu_van",
    "ngoai_ngu",
    "vat_li",
    "hoa_hoc",
    "sinh_hoc",
    "lich_su",
    "dia_li",
    "gdcd",
  ];

  const statistics = await Score.findAll({
    attributes: subjects.flatMap((subject) => [
      [
        literal(`COUNT(CASE WHEN ${subject} >= 8 THEN 1 END)`),
        `${subject}_gte8`,
      ],
      [
        literal(
          `COUNT(CASE WHEN ${subject} >= 6 AND ${subject} < 8 THEN 1 END)`
        ),
        `${subject}_6to8`,
      ],
      [
        literal(
          `COUNT(CASE WHEN ${subject} >= 4 AND ${subject} < 6 THEN 1 END)`
        ),
        `${subject}_4to6`,
      ],
      [
        literal(
          `COUNT(CASE WHEN ${subject} < 4 AND ${subject} IS NOT NULL THEN 1 END)`
        ),
        `${subject}_lt4`,
      ],
    ]),
    where: {
      [Op.or]: subjects.map((subject) => ({
        [subject]: {
          [Op.not]: null,
        },
      })),
    },
  });

  if (!statistics || statistics.length === 0) {
    return {};
  }

  const formattedStats = subjects.reduce((acc, subject) => {
    acc[subject] = {
      greaterThanOrEqual8:
        parseInt(statistics[0].get(`${subject}_gte8`) as string) || 0,
      from6To8: parseInt(statistics[0].get(`${subject}_6to8`) as string) || 0,
      from4To6: parseInt(statistics[0].get(`${subject}_4to6`) as string) || 0,
      lessThan4: parseInt(statistics[0].get(`${subject}_lt4`) as string) || 0,
    };
    return acc;
  }, {} as any);

  return formattedStats;
};

export const getTop10StudentsGroupAService = async () => {
  const sequelize = Score.sequelize as Sequelize;

  const topStudents = await Score.findAll({
    attributes: [
      "sbd",
      "toan",
      "vat_li",
      "hoa_hoc",
      [sequelize.literal("toan + vat_li + hoa_hoc"), "tong_diem"],
    ],
    where: {
      toan: { [Op.ne]: null },
      vat_li: { [Op.ne]: null },
      hoa_hoc: { [Op.ne]: null },
    },
    order: [[sequelize.literal("tong_diem"), "DESC"]],
    limit: 10,
  });

  return topStudents;
};
