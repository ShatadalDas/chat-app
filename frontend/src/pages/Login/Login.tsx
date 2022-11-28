import { ChangeEvent, FormEvent, useState, useEffect } from "react";
import "./Login.scss";
import { useNavigate } from "react-router-dom";
import { api } from "../../utils/api";
import Form from "./components/Form";

function Login() {
  /*%%%%%%%%%%%%%%%%%%%% Variables %%%%%%%%%%%%%%%%%%%%*/
  const [phn, setPhn] = useState("");
  const [pass, setPass] = useState("");
  const [login, setLogin] = useState(sessionStorage.getItem("login"));
  const navigate = useNavigate();

  setInterval(() => {
    setLogin(sessionStorage.getItem("login"));
  }, 200);

  /*%%%%%%%%%%%%%%%%%%%% Functions %%%%%%%%%%%%%%%%%%%%*/

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    api
      .post("/login", {
        phone: phn,
        password: pass,
      })
      .then((res) => {
        const { code } = res.data;
        if (code === 200 || code === 201) {
          console.log(res.data._id);
          sessionStorage.setItem("_id", res.data._id);
          sessionStorage.setItem("phone", phn);
          sessionStorage.setItem("login", "true");
        } else if (code === 400) {
          alert("Error : " + res.data.msg);
        } else {
          navigate("/error");
        }
      })
      .catch((e) => {
        console.log(e);
        navigate("/error");
      });
  }

  useEffect(() => {
    if (login === "true") {
      navigate("/chats");
    }
  }, [login]);

  return (
    <>
      <title>Login - Bubble</title>
      <div className="login">
        <Form
          phn={phn}
          setPhn={setPhn}
          pass={pass}
          setPass={setPass}
          handleSubmit={handleSubmit}
        />
      </div>
    </>
  );
}

export default Login;
