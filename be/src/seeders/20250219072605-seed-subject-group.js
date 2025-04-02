"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const [groupA] = await queryInterface.bulkInsert(
      "subject_groups",
      [
        {
          name: "Group A (Natural Sciences)",
          code: "A",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      { returning: true }
    );

    await queryInterface.bulkUpdate(
      "subjects",
      { groupId: groupA.id },
      {
        code: {
          [Sequelize.Op.in]: ["toan", "vat_li", "hoa_hoc"],
        },
      }
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkUpdate(
      "subjects",
      { groupId: null },
      {
        code: {
          [Sequelize.Op.in]: ["toan", "vat_li", "hoa_hoc"],
        },
      }
    );

    await queryInterface.bulkDelete("subject_groups", {
      code: "A",
    });
  },
};
