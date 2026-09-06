import { useNavigate } from "react-router-dom";
import "../styling/DreamSaved.css";

function DreamSaved() {
  const navigate = useNavigate();

  return (
    <div className="dream-saved-page">

      <div className="dream-saved-container">

        <h1>Dream saved!</h1>

        <h2>
          Your dream has been recorded successfully.
        </h2>

        <p>
          Your dream is now safely stored in your journal.
        </p>

        <button onClick={() => navigate("/journal")}>View In Journal</button>
        <button onClick={() => navigate("/home")}> Back to Home </button>
      </div>

    </div>
  );
}

export default DreamSaved