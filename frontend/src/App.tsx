import "./App.scss";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Chats, Login, Error } from "./pages";

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/chats/*" element={<Chats />} />
          <Route path="/error" element={<Error />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
