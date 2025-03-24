"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const subjects = [
      { name: "toan", createdAt: new Date(), updatedAt: new Date() },
      { name: "ngu_van", createdAt: new Date(), updatedAt: new Date() },
      { name: "ngoai_ngu", createdAt: new Date(), updatedAt: new Date() },
      { name: "vat_li", createdAt: new Date(), updatedAt: new Date() },
      { name: "hoa_hoc", createdAt: new Date(), updatedAt: new Date() },
      { name: "sinh_hoc", createdAt: new Date(), updatedAt: new Date() },
      { name: "lich_su", createdAt: new Date(), updatedAt: new Date() },
      { name: "dia_li", createdAt: new Date(), updatedAt: new Date() },
      { name: "gdcd", createdAt: new Date(), updatedAt: new Date() },
    ];

    await queryInterface.bulkInsert("subjects", subjects, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("subjects", null, {});
  },
};
