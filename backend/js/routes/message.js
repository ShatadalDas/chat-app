var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Router } from "express";
import Messages from "../models/Messages.js";
const router = Router();
router.get("/:sender/:receiver", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { sender, receiver } = req.params;
    try {
        const messages = yield Messages.find({
            $or: [
                { sender, receiver },
                { sender: receiver, receiver: sender },
            ],
        })
            .sort({ createdAt: -1 })
            .select("-createdAt -updatedAt");
        res.json({ code: 200, messages });
    }
    catch (e) {
        res.json({ code: 500 });
    }
}));
export default router;
