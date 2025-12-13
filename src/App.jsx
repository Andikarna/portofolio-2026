import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./views/home.jsx";
import GetUserView from "./views/getusers.jsx";
import "./App.css";

export default function App() {
  return (
    <BrowserRouter>
      <nav>
        <div className="logo">
          <Link to="/">MyPortfolio</Link>
        </div>
        <div>
          <Link to="/">Home</Link>
          <Link to="/user">Projects</Link>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/user" element={<GetUserView />} />
      </Routes>
    </BrowserRouter>
  );
}
