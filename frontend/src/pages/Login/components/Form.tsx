import {
  ChangeEvent,
  Dispatch,
  FormEvent,
  SetStateAction,
  useState,
} from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import "./styles/Form.scss";

interface Props {
  phn: string;
  setPhn: Dispatch<SetStateAction<string>>;
  pass: string;
  setPass: Dispatch<SetStateAction<string>>;
  handleSubmit(e: FormEvent<HTMLFormElement>): Promise<void>;
}

function Form({ phn, setPhn, pass, setPass, handleSubmit }: Props) {
  const [show, setShow] = useState(false);

  function handlePhnInp(e: ChangeEvent<HTMLInputElement>) {
    const str = e.target.value;
    const lastCh = str[str.length - 1];
    if (!lastCh || (parseInt(lastCh) >= 0 && parseInt(lastCh) <= 9)) {
      setPhn(str);
    }
  }

  function handlePassInp(e: ChangeEvent<HTMLInputElement>) {
    setPass(e.target.value);
  }
  return (
    <>
      <form className="frm" onSubmit={handleSubmit}>
        <div className="frm__grp">
          <label htmlFor="phn">Phone</label>
          <input
            type="tel"
            id="phn"
            placeholder="last 10 digits only"
            maxLength={10}
            value={phn}
            onInput={handlePhnInp}
          />
        </div>
        <div className="frm__grp">
          <label htmlFor="pass">Password</label>
          <div className="frm__grp__pass">
            <input
              type={show ? "text" : "password"}
              id="pass"
              placeholder="atleast 4 characters"
              maxLength={18}
              value={pass}
              onChange={handlePassInp}
            />
            <div
              className="frm__grp__pass__icon"
              onClick={() => setShow(!show)}
            >
              <div style={{ display: show ? "none" : "flex" }}>
                <AiFillEye />
              </div>
              <div style={{ display: !show ? "none" : "flex" }}>
                <AiFillEyeInvisible />
              </div>
            </div>
          </div>
        </div>
        <button
          className="frm__btn"
          disabled={phn.length === 10 && pass ? false : true}
        >
          Submit
        </button>
      </form>
    </>
  );
}

export default Form;
