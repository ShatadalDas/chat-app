import { Router } from "express";
import mongoose, { ObjectId } from "mongoose";
import Contacts from "../models/Contacts.js";
import Users from "../models/Users.js";
const router = Router();

router.put("/add", async (req, res) => {
  const { _id, contact, name } = req.body;
  const contactedUser = await Users.findOne({ phone: contact }).select(
    "-password"
  );
  if (contactedUser) {
    const user = await Users.findById(_id);
    if (user) {
      if (user.phone !== contactedUser.phone) {
        const contact = await Contacts.findOne({ user });
        const found = await Contacts.find({
          user,
          contacts: { $elemMatch: { contactUser: contactedUser } },
        });
        console.log(...found);
        if (found.length > 0) {
          res.json({ code: 400, msg: "you already have that contact" });
        } else {
          if (contact) {
            contact.contacts.push({ name, contactUser: contactedUser._id });
            await contact.populate("contacts.contactUser");
            await contact.save();
            res.json({ code: 200, contacts: contact.contacts });
          } else {
            res.json({ code: 500 });
          }
        }
      } else {
        res.json({
          code: 400,
          msg: "you've accidentally entered your own number!",
        });
      }
    } else {
      res.json({ code: 400, msg: "please login first" });
    }
  } else {
    res.json({ code: 400, msg: "user doesn't exist" });
  }
});

router.get("/get/:id", async (req, res) => {
  const { id } = req.params;
  const allContacts = await Contacts.where({ user: id }).select("contacts");
  if (allContacts) {
    res.json({ code: 200, contacts: allContacts[0].contacts });
  } else {
    res.json({ code: 400, msg: "please login correctly" });
  }
});

export default router;
