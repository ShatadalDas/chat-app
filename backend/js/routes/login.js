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
import inputValidate from "../middlewares/inputValidate.js";
import Users from "../models/Users.js";
import bcrypt from "bcrypt";
import Contacts from "../models/Contacts.js";
const router = Router();
router.post("/", inputValidate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { phone, password } = req.body;
    const foundUser = yield Users.findOne({ phone });
    if (foundUser) {
        const hash = foundUser.password;
        if (bcrypt.compareSync(password, hash)) {
            res.json({ code: 200, _id: foundUser._id });
        }
        else {
            res.json({ code: 400, msg: "invalid password" });
        }
    }
    else {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);
        const createdUser = yield Users.create({ phone, password: hash });
        if (createdUser) {
            const contact = yield Contacts.create({
                user: createdUser._id,
                contacts: [],
            });
            yield contact.populate("user");
            if (contact)
                res.json({ code: 201, _id: createdUser._id });
            else
                res.json({ code: 500 });
        }
        else {
            res.json({ code: 500 });
        }
    }
}));
export default router;
