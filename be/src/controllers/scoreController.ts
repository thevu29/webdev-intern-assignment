import { sequelize } from "./../config/database";
import { Request, Response } from "express";
import { literal, Op, Sequelize } from "sequelize";
import Score from "../models/score";

export const getScoreByRegistrationNumber = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const registrationNumber = req.query.registration_number as string;

    if (!registrationNumber) {
      return res
        .status(400)
        .json({ success: false, message: "Registration number is required" });
    }

    const score = await Score.findOne({
      where: { sbd: registrationNumber },
    });

    if (!score) {
      return res
        .status(404)
        .json({ success: false, message: "Registration number not found" });
    }

    return res.status(200).json({
      success: true,
      score,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

// export const getStatistics = async (
//   req: Request,
//   res: Response
// ): Promise<any> => {
//   try {
//     const subjects = [
//       "toan",
//       "ngu_van",
//       "ngoai_ngu",
//       "vat_li",
//       "hoa_hoc",
//       "sinh_hoc",
//       "lich_su",
//       "dia_li",
//       "gdcd",
//     ];

//     const subjectStats: any = {};

//     subjects.forEach((subject) => {
//       subjectStats[subject] = {
//         greaterThanOrEqual8: 0,
//         from6To8: 0,
//         from4To6: 0,
//         lessThan4: 0,
//       };
//     });

//     const scores = await Score.findAll({ attributes: subjects });

//     if (!scores || scores.length === 0) {
//       return res.status(200).json({ success: true, scores: [] });
//     }

//     scores.forEach((score) => {
//       const scoreData = score.get({ plain: true });

//       subjects.forEach((subject) => {
//         const scoreValue = (scoreData as any)[subject];

//         if (scoreValue !== null && !isNaN(scoreValue)) {
//           if (scoreValue >= 8) {
//             subjectStats[subject].greaterThanOrEqual8++;
//           } else if (scoreValue >= 6) {
//             subjectStats[subject].from6To8++;
//           } else if (scoreValue >= 4) {
//             subjectStats[subject].from4To6++;
//           } else {
//             subjectStats[subject].lessThan4++;
//           }
//         }
//       });
//     });

//     return res.status(200).json({
//       success: true,
//       statistics: subjectStats,
//     });
//   } catch (error) {
//     console.error(error);
//     return res
//       .status(500)
//       .json({ success: false, message: "Internal server error" });
//   }
// };

export const getStatistics = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
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
      return res.status(200).json({ success: true, statistics: {} });
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

    return res.status(200).json({
      success: true,
      statistics: formattedStats,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getTop10StudentsGroupA = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
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

    return res.status(200).json({
      success: true,
      topStudents,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
