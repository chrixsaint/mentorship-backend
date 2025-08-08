"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Transactions", {
      transactionId: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4, // ✅ auto-generate UUID
        primaryKey: true,
        allowNull: false,
      },
      userUid: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "Personals", // ✅ must match table name
          key: "userUid", // ✅ references Personal.userUid
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      type: {
        type: Sequelize.ENUM("deposit", "withdrawal", "credit", "debit"),
      },
      amount: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0.0,
      },
      narration: {
        type: Sequelize.STRING,
      },
      transactionReference: {
        type: Sequelize.STRING,
        unique: true,
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
    // ✅ Optional: index for faster lookups by userUid
    await queryInterface.addIndex("Transactions", ["userUid"]);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Transactions");
  },
};
