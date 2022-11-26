import { useState, useEffect } from "react";
// ?import { useDispatch, useSelector } from "react-redux";
import { Route, Routes, useNavigate } from "react-router-dom";
import { ChatsLeft, ChatsRight } from "./components";
import { api } from "../../utils/api";
import "./Chats.scss";
import Default from "./components/Default";

export interface Data {
  name: string;
  contactedUser: string;
  _id: string;
}

function Chats() {
  /*
   *%%%%%%%%%%%%%%%%%% Varibales %%%%%%%%%%%%%%%%%%*/
  const [login, setLogin] = useState(sessionStorage.getItem("login"));
  const [auth, setAuth] = useState(false);
  const navigate = useNavigate();
  const _id = sessionStorage.getItem("_id");
  const [myContacts, setContacts] = useState<Data[]>([
    { _id: "", name: "", contactedUser: "" },
  ]);

  /*
   *%%%%%%%%%%%%%%%%%% Functions %%%%%%%%%%%%%%%%%%*/
  function fetchContacts() {
    if (_id) {
      api
        .get(`/contact/get/${_id}`)
        .then((res) => {
          const { code } = res.data;
          const contacts: Data[] = res.data.contacts;
          if (code === 400) {
            alert("ERROR : " + res.data.msg);
          } else if (code === 500) {
            sessionStorage.removeItem("_id");
            sessionStorage.removeItem("phn");
            sessionStorage.removeItem("login");
            navigate("/error");
          } else if (contacts) {
            setContacts(contacts);
          }
          setAuth(true);
        })
        .catch((e) => {
          console.log(e);
          navigate("/error");
        });
    }
  }

  /*
   *%%%%%%%%%%%%%%%%%% Handlers %%%%%%%%%%%%%%%%%%%*/
  setInterval(() => {
    setLogin(sessionStorage.getItem("login"));
  }, 200);

  useEffect(() => {
    setAuth(login === "true");
    fetchContacts();
  }, []);

  useEffect(() => {
    if (login !== "true") {
      navigate("/");
    } else {
      fetchContacts();
    }
  }, [login]);

  return (
    <div className="chats">
      {auth ? (
        <>
          <ChatsLeft contacts={myContacts} fetchContacts={fetchContacts} />
          <Routes>
            <Route path="/" element={<Default />} />
            <Route path="/:name/:id" element={<ChatsRight />} />
          </Routes>
        </>
      ) : (
        <blockquote></blockquote>
      )}
    </div>
  );
}

export default Chats;
