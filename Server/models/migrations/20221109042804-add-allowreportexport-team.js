const Sequelize = require("sequelize");

module.exports = {
  async up(queryInterface) {
    await queryInterface.addColumn("Team", "allowReportExport", {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn("Team", "allowReportExport");
  }
};
