import { useNavigate } from "react-router-dom";
import "../styling/DreamSaved.css";

function DreamSaved() {
  const navigate = useNavigate();

  return (
    <div className="dream-saved-page">

      <div className="dream-saved-container">

        <h1>Dream saved!</h1>

        <h2>
          Your dream has been recorded, now
          <br />
          generating your interpretation...
        </h2>

        <p>This may take a few seconds...</p>

        <button
          onClick={() => navigate("/journal")}
        >
          View in Journal
        </button>

      </div>

    </div>
  );
}

export default DreamSaved;