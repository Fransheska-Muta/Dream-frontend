import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import HomePage from "./pages/HomePage";
import NewDream from "./pages/NewDream";
import DreamSaved from "./pages/DreamSaved";
import Interpretation from "./pages/Interpretation";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/new-dream" element={<NewDream/>} />
        <Route path="/dream-saved" element={<DreamSaved />}/>
        <Route path="/interpretation" element={<Interpretation />}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App