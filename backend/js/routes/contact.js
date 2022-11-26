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
import Contacts from "../models/Contacts.js";
import Users from "../models/Users.js";
const router = Router();
router.put("/add", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id, contact, name } = req.body;
    const contactedUser = yield Users.findOne({ phone: contact }).select("-password");
    if (contactedUser) {
        const user = yield Users.findById(_id);
        if (user) {
            if (user.phone !== contactedUser.phone) {
                const contact = yield Contacts.findOne({ user });
                const found = yield Contacts.find({
                    user,
                    contacts: { $elemMatch: { contactUser: contactedUser } },
                });
                console.log(...found);
                if (found.length > 0) {
                    res.json({ code: 400, msg: "you already have that contact" });
                }
                else {
                    if (contact) {
                        contact.contacts.push({ name, contactUser: contactedUser._id });
                        yield contact.populate("contacts.contactUser");
                        yield contact.save();
                        res.json({ code: 200, contacts: contact.contacts });
                    }
                    else {
                        res.json({ code: 500 });
                    }
                }
            }
            else {
                res.json({
                    code: 400,
                    msg: "you've accidentally entered your own number!",
                });
            }
        }
        else {
            res.json({ code: 400, msg: "please login first" });
        }
    }
    else {
        res.json({ code: 400, msg: "user doesn't exist" });
    }
}));
router.get("/get/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const allContacts = yield Contacts.where({ user: id }).select("contacts");
    if (allContacts) {
        res.json({ code: 200, contacts: allContacts[0].contacts });
    }
    else {
        res.json({ code: 400, msg: "please login correctly" });
    }
}));
export default router;
