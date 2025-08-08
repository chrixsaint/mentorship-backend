const bcrypt = require("bcrypt");
const fs = require("fs");
const moment = require("moment");
const nodemailer = require("nodemailer");
function responseMessage(res, code, message = null, data = null) {
  const timestamp = Math.floor(Date.now() / 1000);

  return res.status(code).json({
    status: code === 200,
    message: message,
    data: data,
    timestamp: timestamp,
  });
}

async function hashData(data) {
  const saltRounds = 12;
  const salt = await bcrypt.genSalt(saltRounds);
  const hashed = await bcrypt.hash(data, salt);
  // Replace the $2b$ prefix with $2y$
  const modifiedHash = hashed.replace(/^\$2b\$/, "$2y$");

  return modifiedHash;
}

async function comparePassword(plainPassword, hashedPassword) {
  // Normalize the prefix from $2y$ to $2b$ to ensure compatibility
  const normalizedHash = hashedPassword.replace(/^\$2y\$/, "$2b$");

  // Compare the plain password with the hashed password
  const isMatch = await bcrypt.compare(plainPassword, normalizedHash);

  return isMatch;
}

function message500(error) {
  return error.message;
}

function formatDate(created_at) {
  const date = new Date(created_at);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

function formatDateTime(created_at) {
  const date = new Date(created_at);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${day}/${month}/${year} ${hours}:${minutes}`;
}

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000);
}

function generateRandomString(length) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  const charactersLength = characters.length;

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}

function formatSpecialDate(createdAt) {
  const date = new Date(createdAt);

  // Format the date
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  };

  return new Intl.DateTimeFormat("en-US", options).format(date);
}

function deleteFile(file) {
  if (file) {
    // Delete the uploaded file from the destination folder
    const filePath = file.path;
    fs.unlink(filePath, (err) => {});
  }
}

function number_format(
  number,
  decimals = 0,
  decimalSeparator = ".",
  thousandsSeparator = ","
) {
  // Convert number to a string and split into integer and decimal parts
  const [integerPart, decimalPart] = number
    .toFixed(decimals)
    .toString()
    .split(".");

  // Add thousands separators to integer part
  const integerWithSeparators = integerPart.replace(
    /\B(?=(\d{3})+(?!\d))/g,
    thousandsSeparator
  );

  // Combine integer and decimal parts with decimal separator
  const formattedNumber = decimalPart
    ? `${integerWithSeparators}${decimalSeparator}${decimalPart}`
    : integerWithSeparators;

  return formattedNumber;
}

function formatWrittenDate(dateString) {
  const date = new Date(dateString);
  const day = date.getDate();
  const monthIndex = date.getMonth();
  const year = date.getFullYear();

  // Function to get ordinal suffix for day (e.g., 1st, 2nd, 3rd, 4th, ...)
  function getOrdinalSuffix(day) {
    if (day > 3 && day < 21) return "th";
    switch (day % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  }

  // Array of month names
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Format the date as "26th day of March"
  const formattedDate = `${day}${getOrdinalSuffix(day)} day of ${
    monthNames[monthIndex]
  }, ${year} `;

  return formattedDate;
}
function normalizeDate(dateString) {
  const monthNames = {
    jan: 0,
    january: 0,
    feb: 1,
    february: 1,
    mar: 2,
    march: 2,
    apr: 3,
    april: 3,
    may: 4,
    jun: 5,
    june: 5,
    jul: 6,
    july: 6,
    aug: 7,
    august: 7,
    sep: 8,
    september: 8,
    oct: 9,
    october: 9,
    nov: 10,
    november: 10,
    dec: 11,
    december: 11,
  };

  const patterns = [
    { regex: /^(\d{2})-(\d{2})-(\d{4})$/, order: ["day", "month", "year"] }, // DD-MM-YYYY
    { regex: /^(\d{2})-(\w+)-(\d{4})$/, order: ["day", "monthName", "year"] }, // DD-MMM-YYYY or DD-Month-YYYY
    { regex: /^(\d{2}) (\w+) (\d{4})$/, order: ["day", "monthName", "year"] }, // DD MMM YYYY or DD Month YYYY
    { regex: /^(\w+) (\d{2}) (\d{4})$/, order: ["monthName", "day", "year"] }, // MMM DD YYYY or Month DD YYYY
    { regex: /^(\d{2})\/(\d{2})\/(\d{4})$/, order: ["day", "month", "year"] }, // DD/MM/YYYY
    { regex: /^(\d{4})-(\d{2})-(\d{2})$/, order: ["year", "month", "day"] }, // YYYY-MM-DD
    { regex: /^(\d{2}) (\d{2}) (\d{4})$/, order: ["day", "month", "year"] }, // DD MM YYYY
  ];

  let dateParts;
  let year, month, day;

  for (const pattern of patterns) {
    const match = pattern.regex.exec(dateString.toLowerCase());
    if (match) {
      dateParts = match;
      pattern.order.forEach((part, index) => {
        const value = dateParts[index + 1];

        if (part === "year") year = parseInt(value);
        if (part === "month") month = parseInt(value) - 1;
        if (value > 12 && part === "month") {
          throw new Error(`Invalid date format: ${dateString}`);
        }
        if (part === "day") day = parseInt(value);
        if (part === "monthName") month = monthNames[value];
      });
      break;
    }
  }

  if (year === undefined || month === undefined || day === undefined) {
    throw new Error(`Invalid date format: ${dateString}`);
  }

  const date = new Date(year, month, day);

  if (isNaN(date)) {
    throw new Error(`Invalid date format: ${dateString}`);
  }

  const normalizedYear = date.getFullYear();
  const normalizedMonth = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const normalizedDay = String(date.getDate()).padStart(2, "0");

  return `${normalizedYear}-${normalizedMonth}-${normalizedDay}`;
}

const loginTemplate = (code) => {
  return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Monodat Email Verification</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #fdf7f5;
            margin: 0;
            padding: 0;
        }
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background: #ffffff;
            padding: 40px 20px;
            text-align: center;
            border-radius: 8px;
        }
        .header {
            background: #000;
            color: #fff;
            padding: 20px;
            text-align: center;
        }
        .header img {
            height: 24px;
        }
        .content {
            margin: 20px 0;
            font-size: 16px;
            color: #333;
        }
        .verification-code {
            font-size: 24px;
            font-weight: bold;
            margin: 20px 0;
        }
        .footer {
            background: #000;
            color: #fff;
            padding: 20px;
            font-size: 14px;
            text-align: center;
        }
        .footer a {
            color: #fff;
            margin: 0 10px;
            text-decoration: none;
        }
    </style>
</head>
<body>
    <div class="header">
        <img src="/src/monodatlogo.png" alt="Monodat Logo">
          <p>Monodat</p>
    </div>
    <div class="email-container">
        <div class="content">
            <p>Welcome back.</p>
            <p>Use the code below to verify your email.</p>
            <div class="verification-code">${code}</div>
        </div>
    </div>
    <div class="footer">
        <a href="#">Visit our website</a> | 
        <a href="#">Download monostore</a> | 
        <a href="#">Shop mono products</a>
        <p>All rights reserved, Monodat Inc, Lekki, Lagos.</p>
    </div>
</body>
</html>`;
};

const signupMailTemplate = (signupCode) => {
  return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Monodat Email Verification</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #fdf7f5;
            margin: 0;
            padding: 0;
        }
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background: #ffffff;
            padding: 40px 20px;
            text-align: center;
            border-radius: 8px;
        }
        .header {
            background: #000;
            color: #fff;
            padding: 20px;
            text-align: center;
        }
        .header img {
            height: 24px;
        }
        .content {
            margin: 20px 0;
            font-size: 16px;
            color: #333;
        }
        .verification-code {
            font-size: 24px;
            font-weight: bold;
            margin: 20px 0;
        }
        .footer {
            background: #000;
            color: #fff;
            padding: 20px;
            font-size: 14px;
            text-align: center;
        }
        .footer a {
            color: #fff;
            margin: 0 10px;
            text-decoration: none;
        }
    </style>
</head>
<body>
    <div class="header">
        <img src="/src/monodatlogo.png" alt="Monodat Logo">
          <p>Monodat</p>
    </div>
    <div class="email-container">
        <div class="content">
            <p>Thank you for trying to signup.</p>
            <p>Use the code below to verify your email.</p>
            <div class="verification-code">${signupCode}</div>
        </div>
    </div>
    <div class="footer">
        <a href="#">Visit our website</a> | 
        <a href="#">Download monostore</a> | 
        <a href="#">Shop mono products</a>
        <p>All rights reserved, Monodat Inc, Lekki, Lagos.</p>
    </div>
</body>
</html>`;
};

const sendEmailPassword = (signupCode) => {
  return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Monodat Email Verification</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #fdf7f5;
            margin: 0;
            padding: 0;
        }
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background: #ffffff;
            padding: 40px 20px;
            text-align: center;
            border-radius: 8px;
        }
        .header {
            background: #000;
            color: #fff;
            padding: 20px;
            text-align: center;
        }
        .header img {
            height: 24px;
        }
        .content {
            margin: 20px 0;
            font-size: 16px;
            color: #333;
        }
        .verification-code {
            font-size: 24px;
            font-weight: bold;
            margin: 20px 0;
        }
        .footer {
            background: #000;
            color: #fff;
            padding: 20px;
            font-size: 14px;
            text-align: center;
        }
        .footer a {
            color: #fff;
            margin: 0 10px;
            text-decoration: none;
        }
    </style>
</head>
<body>
    <div class="header">
        <img src="/src/monodatlogo.png" alt="Monodat Logo">
          <p>Monodat</p>
    </div>
    <div class="email-container">
        <div class="content">
            <p>Thank you for trying to signup.</p>
            <p>Use the code below to verify your email.</p>
            <div class="verification-code">${signupCode}</div>
        </div>
    </div>
    <div class="footer">
        <a href="#">Visit our website</a> | 
        <a href="#">Download monostore</a> | 
        <a href="#">Shop mono products</a>
        <p>All rights reserved, Monodat Inc, Lekki, Lagos.</p>
    </div>
</body>
</html>`;
};

const mailTransporter = () => {
  const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: true, // true for 465, false for other ports
    auth: {
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  return transporter;
};

module.exports = {
  responseMessage,
  deleteFile,
  normalizeDate,
  signupMailTemplate,
  hashData,
  comparePassword,
  message500,
  formatDateTime,
  number_format,
  formatWrittenDate,
  formatDate,
  generateOtp,
  generateRandomString,
  formatSpecialDate,
  mailTransporter,
  loginTemplate,
  sendEmailPassword,
};
