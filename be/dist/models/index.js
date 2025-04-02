"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Score = exports.Subject = exports.Student = void 0;
const student_1 = __importDefault(require("./student"));
exports.Student = student_1.default;
const subject_1 = __importDefault(require("./subject"));
exports.Subject = subject_1.default;
const score_1 = __importDefault(require("./score"));
exports.Score = score_1.default;
// Define model associations
student_1.default.hasMany(score_1.default, {
    foreignKey: "studentId",
    as: "scores",
    onDelete: "CASCADE",
});
subject_1.default.hasMany(score_1.default, {
    foreignKey: "subjectId",
    as: "scores",
    onDelete: "CASCADE",
});
score_1.default.belongsTo(student_1.default, {
    foreignKey: "studentId",
    as: "student",
});
score_1.default.belongsTo(subject_1.default, {
    foreignKey: "subjectId",
    as: "subject",
});
