"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("scores", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      sbd: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      toan: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      ngu_van: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      ngoai_ngu: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      vat_li: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      hoa_hoc: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      sinh_hoc: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      lich_su: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      dia_li: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      gdcd: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      ma_ngoai_ngu: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });

    await queryInterface.addIndex("scores", ["sbd"]);
    await queryInterface.addIndex("scores", ["toan"]);
    await queryInterface.addIndex("scores", ["ngu_van"]);
    await queryInterface.addIndex("scores", ["ngoai_ngu"]);
    await queryInterface.addIndex("scores", ["vat_li"]);
    await queryInterface.addIndex("scores", ["hoa_hoc"]);
    await queryInterface.addIndex("scores", ["sinh_hoc"]);
    await queryInterface.addIndex("scores", ["lich_su"]);
    await queryInterface.addIndex("scores", ["dia_li"]);
    await queryInterface.addIndex("scores", ["gdcd"]);

    await queryInterface.addIndex(
      "scores",
      [
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
      {
        name: "idx_subjects",
      }
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex("scores", "scores_sbd");
    await queryInterface.removeIndex("scores", "scores_toan");
    await queryInterface.removeIndex("scores", "scores_ngu_van");
    await queryInterface.removeIndex("scores", "scores_ngoai_ngu");
    await queryInterface.removeIndex("scores", "scores_vat_li");
    await queryInterface.removeIndex("scores", "scores_hoa_hoc");
    await queryInterface.removeIndex("scores", "scores_sinh_hoc");
    await queryInterface.removeIndex("scores", "scores_lich_su");
    await queryInterface.removeIndex("scores", "scores_dia_li");
    await queryInterface.removeIndex("scores", "scores_gdcd");
    await queryInterface.removeIndex("scores", "idx_subjects");

    await queryInterface.dropTable("scores");
  },
};
