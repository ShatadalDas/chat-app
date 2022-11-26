var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
httpServer.listen(process.env.PORT || 3000, () => console.log("Server Running..!"));
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
const users = [];
io.on("connection", (socket) => {
    socket.on("connected", (myId) => {
        const me = users.find((user) => user.id === myId);
        if (me) {
            me.socketid = socket.id;
        }
        else {
            users.push({ socketid: socket.id, id: myId });
        }
    });
    socket.on("send", (data) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            console.log(data);
            const sender = yield Users.findById(data.sender);
            const receiver = yield Users.findById(data.receiver);
            if (sender && receiver) {
                const message = yield Messages.create({
                    sender: data.sender,
                    receiver: data.receiver,
                    msg: data.msg,
                    time: data.time,
                });
                yield message.populate("sender receiver");
                const senderContact = yield Contacts.findOne({
                    $and: [{ user: sender }, { contacts: { contactUser: receiver } }],
                });
                if (senderContact) {
                    senderContact.contacts[0].lastMsg = message._id;
                    yield senderContact.save();
                    yield senderContact.populate("contacts");
                }
                const receiverContact = yield Contacts.findOne({
                    $and: [{ user: receiver }, { contacts: { contactUser: sender } }],
                });
                if (receiverContact) {
                    receiverContact.contacts[0].lastMsg = message._id;
                    yield receiverContact.save();
                    yield receiverContact.populate("contacts");
                }
                const to = users.find((user) => user.id === data.receiver);
                console.log("Users: ", users);
                if (to) {
                    socket.broadcast.to(to.socketid).emit("new-msg", {
                        sender,
                        msg: data.msg,
                        time: data.time,
                        _id: "",
                    });
                }
                else {
                    socket.emit("error", "something went wrong");
                }
            }
        }
        catch (error) {
            socket.emit("error", error);
        }
    }));
});
