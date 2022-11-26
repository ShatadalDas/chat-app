import { FormEvent, ChangeEvent, useState, useMemo } from "react";
import "./styles/ChatsLeft.scss";
import { HiUserAdd } from "react-icons/hi";
import { SlOptionsVertical } from "react-icons/sl";
import Contact from "./Contact";
import { Data } from "../Chats";
import Modal from "react-modal";
import { customStyles } from "../../../utils/modalStyles";
import { api } from "../../../utils/api";
import { useNavigate } from "react-router-dom";

interface Props {
  contacts: Data[];
  fetchContacts: () => void;
}

function ChatsLeft({ contacts, fetchContacts }: Props) {
  const [show, setShow] = useState(false);
  const [name, setName] = useState("");
  const [phn, setPhn] = useState("");
  const navigate = useNavigate();

  function handlePhnInp(e: ChangeEvent<HTMLInputElement>) {
    const str = e.target.value;
    const lastCh = str[str.length - 1];
    if (!lastCh || (parseInt(lastCh) >= 0 && parseInt(lastCh) <= 9)) {
      setPhn(str);
    }
  }

  function handleNameInp(e: ChangeEvent<HTMLInputElement>) {
    setName(e.target.value);
  }

  async function handleAddContact(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const _id = sessionStorage.getItem("_id");
    if (_id) {
      api
        .put("/contact/add", {
          _id,
          name,
          contact: phn,
        })
        .then((res) => {
          const { code } = res.data;
          if (code === 200 || code === 201) {
            fetchContacts();
            setShow(false);
          } else if (code === 500) {
            navigate("/error");
          } else if (code === 400) {
            alert("ERROR : " + res.data.msg);
            setPhn("");
          }
        })
        .catch((e) => {
          console.log(e);
          navigate("/error");
        });
    } else {
      navigate("/");
    }
  }

  return (
    <section className="chatsLeft">
      <header className="chatsLeft__header">
        <h1 title="Happy Chatting!">Chats</h1>
        <div className="chatsLeft__header__icons">
          <div
            className="chatsLeft__header__icons__icon"
            title="add a new contact"
            onClick={() => setShow(true)}
          >
            <HiUserAdd />
          </div>
          <div
            className="chatsLeft__header__icons__icon"
            title="logout option here"
          >
            <SlOptionsVertical />
          </div>
        </div>
      </header>
      <aside className="chatsLeft__aside">
        {contacts?.map((contact: any, i) => (
          <Contact name={contact.name} id={contact.contactUser} key={i} />
        ))}
      </aside>

      <Modal
        isOpen={show}
        className="add"
        style={customStyles}
        ariaHideApp={false}
      >
        <form className="add__frm" onSubmit={handleAddContact}>
          <div className="add__frm__grp">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={handleNameInp}
              placeholder="enter the name"
            />
          </div>

          <div className="add__frm__grp">
            <label htmlFor="number">Phone</label>
            <input
              id="number"
              type="tel"
              placeholder="last 10 digits only"
              maxLength={10}
              value={phn}
              onInput={handlePhnInp}
            />
          </div>

          <div className="add__frm__btn">
            <button
              type="reset"
              className="add__frm__btn__cancel"
              onClick={() => {
                setPhn("");
                setName("");
                setShow(false);
              }}
            >
              Cancel
            </button>
            <button
              className="add__frm__btn__save"
              type="submit"
              disabled={name && phn.length === 10 ? false : true}
            >
              Save
            </button>
          </div>
        </form>
      </Modal>
    </section>
  );
}

export default ChatsLeft;
