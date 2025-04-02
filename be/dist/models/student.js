"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
class Student extends sequelize_1.Model {
}
Student.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    sbd: {
        type: sequelize_1.DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
}, {
    tableName: "students",
    sequelize: database_1.sequelize,
});
exports.default = Student;
