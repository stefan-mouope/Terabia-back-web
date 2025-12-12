const express = require("express");
const router = express.Router();
const { Message, User } = require("../models");
const { Op } = require("sequelize");
const { protect } = require("../middleware/authMiddleware");

router.get("/conversation/:otherUserId", protect, async (req, res) => {
  try {
    const userId = req.user.id;
    const otherUserId = req.params.otherUserId;

    const messages = await Message.findAll({
      where: {
        [Op.or]: [
          { from_user_id: userId, to_user_id: otherUserId },
          { from_user_id: otherUserId, to_user_id: userId },
        ],
      },
      include: [
        { model: User, as: "sender", attributes: ["id", "name", "phone"] },
      ],
      order: [["createdAt", "ASC"]],
    });

    res.json({ success: true, messages });
  } catch (err) {
    console.error("Erreur route /conversation:", err);
    res.status(500).json({ success: false, error: "Erreur serveur" });
  }
});

module.exports = router;
