// Import required modules

const express = require("express");
const cors = require("cors");
const fs = require("fs");
const bodyParser = require("body-parser");
const crypto = require("crypto");
const sequelize = "sequelize";
const http = require("http");
const multer = require("multer");
const os = require("os");
const AccessControl = require("accesscontrol");
const ac = new AccessControl();
const db = require("./db/dbConnection");

// Create an Express application
const app = express();
const server = http.createServer(app);

//define .env
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

require("dotenv").config({
  path: `${__dirname}/.env`,
});

// DATABASE CONNECTION
const mysql = require("mysql");

app.use("/", require("./routes/web.js"));
app.use("/api", require("./routes/api.js"));
app.use("/test", require("./routes/test.js"));

// Define a route
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on port ${PORT}`);
});
