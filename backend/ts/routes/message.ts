import { Router } from "express";
import Messages from "../models/Messages.js";
const router = Router();

router.get("/:sender/:receiver", async (req, res) => {
  const { sender, receiver } = req.params;
  try {
    const messages = await Messages.find({
      $or: [
        { sender, receiver },
        { sender: receiver, receiver: sender },
      ],
    })
      .sort({ createdAt: -1 })
      .select("-createdAt -updatedAt");

    res.json({ code: 200, messages });
  } catch (e) {
    res.json({ code: 500 });
  }
});

export default router;
