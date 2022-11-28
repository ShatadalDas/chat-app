import dotenv from "dotenv";
dotenv.config();
import express from "express";
const app = express();
import cors from "cors";
app.use(cors());
app.use(express.json());
import conn from "./config/conn.js";
conn();
import { createServer } from "http";
const httpServer = createServer(app);
httpServer.listen(process.env.PORT || 3000, () =>
  console.log("Server Running..!")
);

/*
 *%%%%%%%%%%%% Routes %%%%%%%%%%%%*/
import loginRoute from "./routes/login.js";
import addContactRoute from "./routes/contact.js";
import messageRoute from "./routes/message.js";

app.use("/login", loginRoute);
app.use("/contact", addContactRoute);
app.use("/message", messageRoute);

/*
 *%%%%%%%%%%%% Socket IO %%%%%%%%%%%%*/
import { Server } from "socket.io";
import Messages from "./models/Messages.js";
import Users from "./models/Users.js";
import Contacts from "./models/Contacts.js";
const io = new Server(httpServer, {
  cors: {
    origin: process.env.SOCKET_URL,
  },
});

interface Users {
  socketid: string;
  id: string;
}

let users: Users[] = [];

io.on("connection", (socket) => {
  console.log("User Connected");

  socket.on("connected", (myId) => {
    console.log("User Res");
    const me = users.find((user) => user.id === myId);
    if (me) {
      me.socketid = socket.id;
    } else {
      users.push({ socketid: socket.id, id: myId });
    }
    console.log("Users: ", users);
  });

  socket.on("check", (id) => {
    const isUser = users.find((user) => user.id === id);
    if (isUser) {
      socket.emit("res", "Online");
    } else {
      socket.emit("res", "Offline");
    }
  });

  socket.on("send", async (data) => {
    try {
      console.log(data);
      const sender = await Users.findById(data.sender);
      const receiver = await Users.findById(data.receiver);
      if (sender && receiver) {
        const message = await Messages.create({
          sender: data.sender,
          receiver: data.receiver,
          msg: data.msg,
          time: data.time,
        });
        await message.populate("sender receiver");
        const senderContact = await Contacts.findOne({
          $and: [{ user: sender }, { contacts: { contactUser: receiver } }],
        });
        if (senderContact) {
          senderContact.contacts[0].lastMsg = message._id;
          await senderContact.save();
          await senderContact.populate("contacts");
        }
        const receiverContact = await Contacts.findOne({
          $and: [{ user: receiver }, { contacts: { contactUser: sender } }],
        });
        if (receiverContact) {
          receiverContact.contacts[0].lastMsg = message._id;
          await receiverContact.save();
          await receiverContact.populate("contacts");
        }
        const to = users.find((user) => user.id === data.receiver);
        if (to) {
          socket.broadcast.to(to.socketid).emit("new-msg", {
            sender,
            msg: data.msg,
            time: data.time,
            _id: "",
          });
        } else {
          socket.emit("error", "something went wrong");
        }
      }
    } catch (error) {
      socket.emit("error", error);
    }
  });

  socket.on("disconnect", () => {
    const usr = users.find((user) => user.socketid === socket.id);
    users = users.filter((user) => user.socketid !== socket.id);
    socket.broadcast.emit("discon", usr?.id);
  });
});
