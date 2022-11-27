import "./App.scss";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Chats, Login, Error } from "./pages";
import { io } from "socket.io-client";
const socket = io("http://localhost:2000");

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/chats/*" element={<Chats socket={socket} />} />
          <Route path="/error" element={<Error />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
