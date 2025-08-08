const db = require("../../models");
const { Personal, Balance, Transaction } = db;

class FetchUserDetails {
  static async getUserDetails(req, res) {
    const { userUid } = req.authUser; // ✅ Extract userUid from JWT payload

    try {
      const user = await Personal.findByPk(userUid, {
        attributes: { exclude: ["password"] }, // ✅ never send password
        include: [
          {
            model: Balance,
            as: "balances", // ✅ must match alias in the Personal.associate table
            attributes: ["balanceId", "balance1", "balance2", "userUid"],
          },
          {
            model: Transaction,
            as: "transactions", // ✅ alias must match association
            attributes: [
              "transactionId",
              "type",
              "amount",
              "narration",
              "transactionReference",
              "createdAt",
            ],
            limit: 5, // ✅ optional: return last 5 transactions
            order: [["createdAt", "DESC"]],
          },
        ],
      });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json(user);
    } catch (error) {
      console.error("❌ FetchUserDetails Error:", error);
      res.status(500).json({ message: "Error fetching user details" });
    }
  }
}

module.exports = FetchUserDetails;
