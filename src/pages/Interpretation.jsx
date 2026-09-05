import { useNavigate } from "react-router-dom";
import "../styling/interpretation.css";

function Interpretation() {
  const navigate = useNavigate();
  return (
    <div className="interpretation-page">
      <header className="interpretation-header">
        <h1>Dream Journal</h1>
      </header>

      <main className="interpretation-container">
        <h2>Your Dream Interpretation</h2>
        <div className="interpretation-card">
          <h3>Your dream</h3>
          <p className="dream-description">Your dream will appear here...</p>

          <div className="interpretation-divider"></div>
          <h3>Interpretation</h3>

          <p className="interpretation-text">Your AI-generated dream interpretation willappear here...</p>
        </div>

        <div className="interpretation-actions">

          <button onClick={() => navigate("/journal")}>View in Journal</button>
          <button onClick={() => navigate("/home")}>Back to Home</button>
        </div>
      </main>
    </div>
  )
}

export default Interpretation