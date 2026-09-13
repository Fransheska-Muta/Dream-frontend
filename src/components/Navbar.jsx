import { useNavigate, useLocation } from "react-router-dom";
import "../styling/Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    sessionStorage.removeItem("auth");
    sessionStorage.removeItem("user");
    navigate("/");
  }

  return (
    <nav className="navbar">

      <div className="navbar-logo" onClick={() => navigate("/home")}>
        Dream Journal
      </div>

      <div className="navbar-links">

        <button className={ location.pathname === "/home" ? "nav-link active": "nav-link"}
          onClick={() => navigate("/home")}>
          Home
        </button>


        <button className={ location.pathname === "/new-dream"? "nav-link active": "nav-link"}
          onClick={() => navigate("/new-dream")}>
          New Dream
        </button>

        <button className={ location.pathname === "/journal"? "nav-link active": "nav-link"}
          onClick={() => navigate("/journal")}>
          My Journal
        </button>

        <button className={location.pathname === "/analytics"? "nav-link active": "nav-link"}
          onClick={() => navigate("/analytics")}>
          Analytics
        </button>

      </div>
      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>
    </nav>
  )
}

export default Navbar