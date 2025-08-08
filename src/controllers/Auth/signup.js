// Import helper functions for email templates and responses
const {
  signupMailTemplate, // HTML email template for signup
  // sendemailSignupTemplate,
  responseMessage, // Standard response formatter
} = require("../../helpers/helpers");
const { mailTransporter } = require("../../helpers/helpers"); // Email service setup
const db = require("../../models/index"); // Database connection
const { Personal, TempSignupCodes } = db; // Extract specific database models
const generateToken = require("../../helpers/generateToken"); // JWT token creator
const crypto = require("crypto"); // Cryptographic functions
const moment = require("moment"); // Date/time manipulation library
const expiresAt = moment().add(7, "days").toDate(); // Set expiration to 7 days from now
const bcrypt = require("bcrypt"); // Password hashing library
const saltRounds = 10; // Strength of password hashing (10 rounds)

class SignupController {
  // Main signup method - completes user registration with verification code
  static signup = async (req, res) => {
    // Extract user data from request body (destructuring)
    const { email, code, firstName, lastName, country, password } = req.body;

    const authUser = req.authUser; // Get authenticated user info

    try {
      // Find the most recent signup code for this email
      const tempSignupCodes = await TempSignupCodes.findOne({
        where: { userEmail: email },
        order: [["timeCreated", "DESC"]], // Most recent first
      });

      // Check if signup code exists
      if (!tempSignupCodes) {
        return res.status(404).send({ message: "No signup code detected" });
      }

      // Verify the provided code matches the stored code
      if (tempSignupCodes.signupCode.toString() !== code.toString()) {
        return res.status(400).send({ message: "Code is invalid" });
      }

      // Check if user already exists with this email
      const userexist = await Personal.findOne({
        where: {
          userEmail: email,
        },
      });
      if (userexist) {
        return responseMessage(res, 400, "User with email already exist");
      }

      // Create new user record with hashed password
      const personal = await Personal.create({
        lastLoginCode: 1234, // Default login code
        accountType: "user", // Set account type
        profileStatus: true, // Activate profile
        firstName: firstName,
        lastName: lastName,
        userEmail: email,
        country: country,
        password: bcrypt.hashSync(password, saltRounds), // Hash password before storing
      });

      // Generate authentication token for the new user
      const customToken = await generateToken(personal);

      // Send success response with token and user data
      return res.status(200).send({
        message: "User registered successfully",
        token: customToken,
        userUid: personal.userUid,
        personal,
      });
    } catch (error) {
      // Handle any errors during signup process
      return res
        .status(500)
        .send({ message: `Error creating user: ${error.message}` });
    }
  };

  // Send verification email with signup code
  static sendemailSignup = async (req, res) => {
    const { email } = req.body; // Extract email from request

    // Generate random 4-digit verification code
    const generateSixDigitCode = () => {
      return Math.floor(1000 + Math.random() * 9000); // Returns number between 1000-9999
    };

    const code = generateSixDigitCode(); // Create the verification code

    // Check if user already exists before sending email
    const userexist = await Personal.findOne({
      where: {
        userEmail: email,
      },
    });
    if (userexist) {
      return responseMessage(res, 400, "User with email already exist");
    }

    try {
      // Store temporary signup code in database
      await TempSignupCodes.create({
        userEmail: email,
        signupCode: code,
        timeCreated: new Date(), // Current timestamp
        numberOfTrials: 1, // Track usage attempts
      });
    } catch (err) {
      console.error("Error creating temp signup code:", err.message);
    }

    // Set up email transporter and message content
    const transporter = mailTransporter();
    const mailOptions = {
      from: `${process.env.MAIL_FROM_NAME} <${process.env.MAIL_FROM_EMAIL}>`, // Sender info from environment
      to: email, // Recipient email
      subject: "Verify account", // Email subject
      html: signupMailTemplate(code), // HTML email body with code
    };

    const customToken = await generateToken(userexist); // Generate token (Note: userexist might be null here)

    // Send the verification email
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        // Handle email sending error
        return responseMessage(res, 500, error.message, info);
      } else {
        // Email sent successfully
        return res.status(200).send({
          personal: userexist,
          message: "User signed up successfully",
          token: customToken,
        });
      }
    });
  };
}

module.exports = SignupController; // Export the class for use in other files
