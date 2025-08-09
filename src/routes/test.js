const express = require("express");
const router = express.Router();
const db = require("../models"); // adjust path if needed

// const { randomUUID } = require("crypto"); // optional

router.post("/populate-user-data", async (req, res) => {
  const { userUid, userEmail, reset } = req.body;
  if (!userUid || !userEmail) {
    return res.status(400).json({ message: "Missing userUid or userEmail" });
  }

  try {
    await db.Balance.upsert({
      userUid,
      userEmail,
      balance1: 1200.0,
      balance2: 2400.0,
    });

    // Optional: wipe prior transactions for this user on demand
    if (reset) {
      await db.Transaction.destroy({ where: { userUid } });
    }

    // Unique refs per run
    const now = Date.now();
    const refs = Array.from({ length: 5 }, (_, i) => `TXN-${userUid.slice(0,8)}-${now}-${i}`);
    // Or: const refs = Array.from({ length: 5 }, () => `TXN-${randomUUID()}`);

    await db.Transaction.bulkCreate(
      [
        { userUid, type: "deposit",    amount: 550,  narration: "Wallet funding", transactionReference: refs[0], createdAt: new Date() },
        { userUid, type: "withdrawal", amount: 930,  narration: "ATM withdrawal", transactionReference: refs[1], createdAt: new Date() },
        { userUid, type: "deposit",    amount: 210, narration: "Wallet funding", transactionReference: refs[2], createdAt: new Date() },
        { userUid, type: "withdrawal", amount: 700,  narration: "ATM withdrawal", transactionReference: refs[3], createdAt: new Date() },
        { userUid, type: "deposit",    amount: 190, narration: "Wallet funding", transactionReference: refs[4], createdAt: new Date() },
      ],
      { ignoreDuplicates: true } // prevents unique-constraint errors on reruns
      // If you prefer updates on same reference instead:
      // { updateOnDuplicate: ["amount", "narration", "type", "createdAt", "updatedAt"] }
    );

    res.status(201).json({ message: "User balances & transactions populated" });
  } catch (error) {
    console.error("Error populating user data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
