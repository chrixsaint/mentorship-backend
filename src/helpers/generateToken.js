const crypto = require("crypto");
const db = require("../models/index.js");
const { Personal, PersonalAccessToken } = db;
const moment = require("moment");
const expiresAt = moment().add(7, "days").toDate();
const { responseMessage } = require("../helpers/helpers.js");

const generateToken = async (personal) => {
  try {
    // Generate a random token using crypto
    const token = crypto.randomBytes(32).toString("hex"); // 32 bytes = 64 character token

    // Hash the token using SHA-256 for secure storage
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const personalAccessToken = await PersonalAccessToken.create({
      token: hashedToken,
      expires_at: expiresAt,
      last_updated_at: new Date(),
      tokenable_id: personal.userUid, // Assuming tokenable_id is the user ID
      tokenable_type: "Src\\Models\\Personal", // Set the tokenable type
    });

    // Combine DB ID with the raw token to return to client
    const authToken = `${personalAccessToken.id}|${token}`;

    // Respond with the generated token (non-hashed version)
    return authToken;
  } catch (error) {
    console.error("generateToken error:", error); // <-- Added error log here
    return null;
  }
};

module.exports = generateToken;
