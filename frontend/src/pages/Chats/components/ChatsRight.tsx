import {
  FormEvent,
  KeyboardEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import "./styles/ChatsRight.scss";
import { IoSend } from "react-icons/io5";
import Bubble from "./Bubble";
import { useParams } from "react-router-dom";
import { api } from "../../../utils/api";
import { io, Socket } from "socket.io-client";

interface Message {
  sender: string;
  msg: string;
  time: string;
  _id: string;
}

const socket = io("http://localhost:2000");
socket.connect();

function ChatsRight() {
  /*
   *%%%%%%%%%%%%%%%%%%%% Variables %%%%%%%%%%%%%%%%%%%%%%%*/
  const [msg, setMsg] = useState("");
  const form = useRef<HTMLFormElement>(null);
  const myid = sessionStorage.getItem("_id");
  const receiver = useParams();
  const [messages, setMessages] = useState<Message[]>([]);

  /*
   *%%%%%%%%%%%%%%%%%%%% Functions %%%%%%%%%%%%%%%%%%%%%%%*/
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (msg && myid) {
      const date = new Date();
      let h = date.getHours();
      const m = date.getMinutes();
      const greet = h >= 12 ? "PM" : "AM";
      if (h === 12) h++;
      h %= 12;
      const time = `${h}:${m < 10 ? "0" + m : m} ${greet}`;
      const msgObj = {
        sender: myid,
        msg,
        time,
        _id: "",
      };
      setMessages((state) => [msgObj, ...state]);
      setMsg("");
      socket.emit("send", {
        sender: myid,
        receiver: receiver.id,
        msg,
        time,
      });
    }
  }

  function handleEnter(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      form.current?.requestSubmit();
    }
  }

  function fetchMessages() {
    api
      .get(`/message/${myid}/${receiver.id}`)
      .then((res) => {
        const { code } = res.data;
        if (code === 200) {
          setMessages(res.data.messages);
          console.table(res.data.messages);
        } else if (code === 400) {
          alert("ERROR : " + res.data.msg);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }

  /*
   *%%%%%%%%%%%%%%%%%%%% useEffects %%%%%%%%%%%%%%%%%%%%%%%*/
  useEffect(() => {
    fetchMessages();
  }, [receiver.id]);

  useEffect(() => {
    if (socket.connected) {
      socket.emit("connected", myid);
      socket.on("new-msg", (data) => {
        setMessages((state) => [data, ...state]);
      });
    }
  }, [socket]);

  /*
   *%%%%%%%%%%%%%%%%%%%% Return %%%%%%%%%%%%%%%%%%%%%%%*/
  return (
    <section className="right">
      <header className="right__header">
        <h2>{receiver.name}</h2>
        <h3>online</h3>
      </header>

      <main className="right__main">
        {messages.map((msg, i) => {
          return (
            <Bubble key={i} sender={msg.sender} time={msg.time} txt={msg.msg} />
          );
        })}
      </main>

      <footer className="right__footer">
        <form className="right__footer__frm" onSubmit={handleSubmit} ref={form}>
          <textarea
            placeholder="enter a message"
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            onKeyDown={handleEnter}
            maxLength={1000}
          />
          <button type="submit">
            <IoSend />
          </button>
        </form>
      </footer>
    </section>
  );
}

export default ChatsRight;
