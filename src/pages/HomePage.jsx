import { useNavigate } from "react-router-dom";
import "../styling/HomePage.css";

function HomePage() {
  const navigate = useNavigate();

  // Get the current hour
  const hour = new Date().getHours();

  let greeting;

  if (hour < 12) {
    greeting = "Good Morning";
  } else if (hour < 18) {
    greeting = "Good Afternoon";
  } else {
    greeting = "Good Evening";
  }

  return (
    <div className="home-page">

      {/* Logo / App Name */}
      <header className="home-header">
        <h1>Dream Journal</h1>
      </header>

      {/* Main Content */}
      <main className="home-content">

        <p className="greeting">{greeting}</p>

        <h2>
          Every dream holds a
          <br />
          message, find out what
          <br />
          yours is
        </h2>

        <button
          className="record-button"
          onClick={() => navigate("/new-dream")}
        >
          Record a new dream
        </button>

      </main>

    </div>
  );
}

export default HomePage