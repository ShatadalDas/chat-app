import { Router } from "express";
import inputValidate from "../middlewares/inputValidate.js";
import Users from "../models/Users.js";
import bcrypt from "bcrypt";
import Contacts from "../models/Contacts.js";
const router = Router();

router.post("/", inputValidate, async (req, res) => {
  const { phone, password } = req.body;
  const foundUser = await Users.findOne({ phone });

  if (foundUser) {
    const hash = foundUser.password;
    if (bcrypt.compareSync(password, hash)) {
      res.json({ code: 200, _id: foundUser._id });
    } else {
      res.json({ code: 400, msg: "invalid password" });
    }
  } else {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    const createdUser = await Users.create({ phone, password: hash });
    if (createdUser) {
      const contact = await Contacts.create({
        user: createdUser._id,
        contacts: [],
      });
      await contact.populate("user");
      if (contact) res.json({ code: 201, _id: createdUser._id });
      else res.json({ code: 500 });
    } else {
      res.json({ code: 500 });
    }
  }
});

export default router;
