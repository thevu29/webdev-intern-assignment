"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const subjects = [
      { name: "toan", code: "toan" },
      { name: "ngu_van", code: "ngu_van" },
      { name: "ngoai_ngu", code: "ngoai_ngu" },
      { name: "vat_li", code: "vat_li" },
      { name: "hoa_hoc", code: "hoa_hoc" },
      { name: "sinh_hoc", code: "sinh_hoc" },
      { name: "lich_su", code: "lich_su" },
      { name: "dia_li", code: "dia_li" },
      { name: "gdcd", code: "gdcd" },
    ];

    await queryInterface.bulkInsert("subjects", subjects, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("subjects", null, {});
  },
};
