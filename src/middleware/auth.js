const crypto = require("crypto");
const db = require("../models/index.js");
const { Personal, PersonalAccessToken } = db;
const { responseMessage } = require("../helpers/helpers.js");

const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return responseMessage(res, 401, "Unauthenticated", null);
    }

    const token = authHeader.split("|")[1];

    // Hashing of the token using SHA-256
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    console.log(hashedToken);

    // Find the token in the database
    const personalAccessToken = await PersonalAccessToken.findOne({
      where: { token: hashedToken },
    });

    if (!personalAccessToken) {
      return responseMessage(res, 401, "Invalid authenticated token", null);
    }

    // Find the user associated with the token
    const personal = await Personal.findOne({
      where: { userUid: personalAccessToken.tokenable_id },
    });

    const currentDate = new Date();

    // Check if the user is authenticated, if tokenable_type matches, and if the token has expired
    if (
      !personal ||
      personalAccessToken.tokenable_type !== "Src\\Models\\Personal" ||
      new Date(personalAccessToken.expires_at) < currentDate
    ) {
      return responseMessage(res, 401, "Unauthenticated", null);
    }

    // Attach user to request
    req.authUser = personal.dataValues;
    req.authPersonalAccessToken = personalAccessToken;
    next();
  } catch (error) {
    console.log(error.message);
    return responseMessage(res, 500, error.message, null);
  }
};

module.exports = auth;
