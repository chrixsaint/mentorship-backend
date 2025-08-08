const {
  signupMailTemplate,
  // sendemailSignupTemplate,
  responseMessage,
} = require("../../helpers/helpers");
const { mailTransporter } = require("../../helpers/helpers");
const db = require("../../models/index");
const { Personal, TempSignupCodes } = db;
const generateToken = require("../../helpers/generateToken");
const crypto = require("crypto");
const moment = require("moment");
const expiresAt = moment().add(7, "days").toDate();
const bcrypt = require("bcrypt");
const saltRounds = 10;

class LoginController {
  static login = async (req, res) => {
    const { email, password } = req.body;

    const authUser = req.authUser;

    try {
      const personal = await Personal.findOne({
        where: {
          userEmail: email,
        },
      });
      if (!personal) {
        return responseMessage(res, 400, "User does not exist");
      }

      const isMatch = await bcrypt.compare(password, personal.password);
      if (!isMatch) {
        return responseMessage(res, 401, "Invalid password");
      }
      // ✅ Generate token only if password is correct
      const customToken = await generateToken(personal);
      console.log("Generated token:", customToken); // <-- Debug print token

      return res.status(200).send({
        message: "User logged in successfully",
        token: customToken,
        personal,
      });
    } catch (error) {
      return res
        .status(500)
        .send({ message: `Error creating user: ${error.message}` });
    }
  };

  static sendemailSignup = async (req, res) => {
    const { email } = req.body;

    const generateSixDigitCode = () => {
      return Math.floor(1000 + Math.random() * 9000);
    };

    const code = generateSixDigitCode();

    const userexist = await Personal.findOne({
      where: {
        userEmail: email,
      },
    });
    if (userexist) {
      return responseMessage(res, 400, "User with email already exist");
    }

    try {
      await TempSignupCodes.create({
        userEmail: email,
        signupCode: code,
        timeCreated: new Date(),
        numberOfTrials: 1,
      });
    } catch (err) {
      console.error("Error creating temp signup code:", err.message);
    }

    const transporter = mailTransporter();
    const mailOptions = {
      from: `${process.env.MAIL_FROM_NAME} <${process.env.MAIL_FROM_EMAIL}>`,
      to: email,
      subject: "Verify account",
      html: signupMailTemplate(code),
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        return responseMessage(res, 500, error.message, info);
      } else {
        return res.status(200).send({ message: "Email sent" });
      }
    });
  };
}

module.exports = LoginController;
