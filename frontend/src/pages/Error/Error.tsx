import "./Error.scss";
import { FaServer } from "react-icons/fa";
import { BiErrorCircle } from "react-icons/bi";
import { Link } from "react-router-dom";

function Error() {
  return (
    <div className="error">
      <BiErrorCircle className="error-bg-icon" />
      <header className="error__header">
        <FaServer />
        <h1 title="sorry, it's our fault">500</h1>
      </header>
      <blockquote>
        <h2>Internal Server Error!</h2>
        <p>Please try to login again.</p>
        <Link className="error__link" to="/">
          Go to login page
        </Link>
      </blockquote>
    </div>
  );
}

export default Error;
