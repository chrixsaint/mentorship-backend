"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Personals", {
      // id: {
      //   allowNull: false,
      //   autoIncrement: true,
      //   primaryKey: true,
      //   type: Sequelize.INTEGER,
      // },
      userUid: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true, // ✅ userUid is the primary key
        unique: true, // ✅ ensures FK can reference this
      },
      firstName: {
        type: Sequelize.STRING,
      },
      lastName: {
        type: Sequelize.STRING,
      },
      country: {
        type: Sequelize.STRING,
      },
      userEmail: {
        type: Sequelize.STRING,
      },
      password: {
        type: Sequelize.STRING,
      },
      profileStatus: {
        type: Sequelize.BOOLEAN,
      },
      lastLoginCode: {
        type: Sequelize.INTEGER,
      },
      accountType: {
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });

    // ✅ Add an index to userUid for foreign keys
    await queryInterface.addIndex("Personals", ["userUid"]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Personals");
  },
};
