"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
class Score extends sequelize_1.Model {
}
Score.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    studentId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "students",
            key: "id",
        },
    },
    subjectId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "subjects",
            key: "id",
        },
    },
    score: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    sequelize: database_1.sequelize,
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
});
exports.default = Score;
