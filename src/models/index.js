"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
require("dotenv").config(); // Loads .env variables
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const db = {};

// const sequelize = new Sequelize(
//   process.env.DB_NAME,
//   process.env.DB_USER,
//   process.env.DB_PASSWORD,
//   {
//     host: process.env.DB_HOST,
//     dialect: process.env.DB_DIALECT,
//   }
// );

const sequelize = new Sequelize(
  "mentorship_db",
  "mentor_user",
  "supersecure123",
  {
    host: "127.0.0.1",
    dialect: "mysql",
  }
);

console.log(process.env.DB_NAME);

console.log(process.env.DB_PASSWORD);

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 &&
      file !== basename &&
      file.slice(-3) === ".js" &&
      file.indexOf(".test.js") === -1
    );
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes
    );
    db[model.name] = model;
  });

// ✅ Call associate() if any model has it
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// ✅ Export Sequelize and Models
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
