"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Balances", {
      balanceId: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4, // ✅ auto-generate UUID
        primaryKey: true,
        allowNull: false,
      },
      userUid: {
        type: Sequelize.UUID,
        allowNull: false,
        unique: true,
        references: {
          model: "Personals", // ✅ must match table name
          key: "userUid", // ✅ references Personal.userUid
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      balance1: {
        type: Sequelize.DECIMAL(10, 2), // ✅ safer than generic DECIMAL
        defaultValue: 0.0,
      },
      balance2: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0.0,
      },
      userEmail: {
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    });

    // ✅ Optional: index for faster lookups by userUid
    await queryInterface.addIndex("Balances", ["userUid"]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Balances");
  },
};
