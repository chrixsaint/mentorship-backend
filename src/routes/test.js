const express = require("express");
const router = express.Router();
const db = require("../models"); // adjust path if needed

// Temporary route to add balances and transactions to an existing user
router.post("/populate-user-data", async (req, res) => {
  const { userUid, userEmail } = req.body;

  if (!userUid || !userEmail) {
    return res.status(400).json({ message: "Missing userUid or userEmail" });
  }

  try {
    // ✅ Create or update balance (ensure only one per user)
    await db.Balance.upsert({
      userUid,
      userEmail,
      balance1: 300.0,
      balance2: 800.0,
    });

    // ✅ Create sample transactions
    await db.Transaction.bulkCreate([
      {
        userUid,
        type: "deposit",
        amount: 250,
        narration: "Initial deposit",
        transactionReference: "TXN100001",
        createdAt: new Date(),
      },
      {
        userUid,
        type: "withdrawal",
        amount: 100,
        narration: "ATM withdrawal",
        transactionReference: "TXN100002",
        createdAt: new Date(),
      },
    ]);

    res.status(201).json({ message: "User balances & transactions populated" });
  } catch (error) {
    console.error("Error populating user data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
