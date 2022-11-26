import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/Contact.scss";

interface Props {
  name: string;
  id: string;
}

function Contact(props: Props) {
  const { name, id } = props;
  const [del, setDel] = useState(false);
  const cont = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  console.log("name", name);
  return (
    <div
      className="contact"
      onContextMenu={(e) => {
        e.preventDefault();
        confirm("delete chat ?") ? setDel(true) : setDel(false);
      }}
      style={{ display: del ? "none" : "flex" }}
      ref={cont}
      onClick={() => {
        navigate(`/chats/${name}/${id}`);
      }}
    >
      <h2 className="contact__name">{props.name}</h2>
      <h3 className="contact__last-msg">
        <span className="sender">You:</span>
      </h3>
    </div>
  );
}

export default Contact;
