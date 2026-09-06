import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styling/NewDream.css";

function NewDream() {
  const navigate = useNavigate();
  const [description, setDescription] = useState("");
  const [mood, setMood] = useState("");
  const [wantInterpretation, setWantInterpretation] = useState(null);

const handleSave = async () => {
  if (!description.trim()) {
    alert("Please write your dream first.");
    return;
  }

  if (!mood) {
    alert("Please select how you felt after waking up.");
    return;
  }

  if (wantInterpretation === null) {
    alert("Please choose whether you want an AI interpretation.");
    return;
  }

  const auth = sessionStorage.getItem("auth");

  if (!auth) {
    alert("You are not logged in.");
    navigate("/");
    return;
  }

  try {
    // =========================
    // 1. SAVE DREAM
    // =========================

    const dreamResponse = await fetch(
      "http://localhost:3000/dreams",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: auth,
        },

        body: JSON.stringify({
          description,
          mood,
          dreamDate: new Date(),
        }),
      }
    );

    const dreamData = await dreamResponse.json();

    if (!dreamResponse.ok) {
      alert(dreamData.message);
      return;
    }

    console.log("Dream saved:", dreamData);


    // =========================
    // 2. AI INTERPRETATION
    // =========================

    if (wantInterpretation === true) {

      const interpretationResponse = await fetch(
        `http://localhost:3000/interpret/${dreamData.dreamId}`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: auth,
          }
        }
      );

      const interpretationData =
        await interpretationResponse.json();

      if (!interpretationResponse.ok) {
        alert(interpretationData.message);
        return;
      }

      // Save the interpretation temporarily
      sessionStorage.setItem(
        "interpretation",
        interpretationData.interpretation
      );

      // Save the dream temporarily too
      sessionStorage.setItem(
        "dreamDescription",
        description
      );

      sessionStorage.setItem(
        "dreamMood",
        mood
      );

        // Save interpretation ID
  sessionStorage.setItem(
    "interpretationId",
    interpretationData.interpretationId
  );

      navigate("/interpretation");

    } else {

      // User doesn't want AI
      navigate("/dream-saved");

    }

  } catch (error) {

    console.error("Error:", error);

    alert("Unable to connect to the server.");
  }
}
  return (
    <div className="new-dream-page">
      <header className="new-dream-header">
        <h1>Dream Journal</h1>
      </header>

      <main className="new-dream-container">
        <h2>New Dream</h2>
        <div className="dream-section">
          <h3>Dream Details</h3>
          <textarea value={description} onChange={(event) => setDescription(event.target.value)}
            placeholder="Write down what you remember from your dream..."
          />
        </div>
{/* mood selection */}
        <div className="mood-section">
          <h3>How did you feel after waking up?</h3>
          <div className="mood-options">
            <button className={mood === "Very Bad" ? "selected" : ""} onClick={() => setMood("Very Bad")}>Very Bad</button>
            <button className={mood === "Neutral" ? "selected" : ""} onClick={() => setMood("Neutral")}>Neutral</button>
            <button className={mood === "Happy" ? "selected" : ""} onClick={() => setMood("Happy")}>Happy</button>
            <button className={mood === "Great" ? "selected" : ""} onClick={() => setMood("Great")}>Great</button>
          </div>
        </div>

        {/* AI Interpretation*/}
        <div className="interpretation-choice">
          <h3> Would you like an AI interpretationof your dream?</h3>
          <div className="interpretation-buttons">
            <button className={wantInterpretation === true? "selected": ""}onClick={() =>setWantInterpretation(true)}>Yes please</button>
            <button className={ wantInterpretation === false ? "selected": ""}onClick={() =>setWantInterpretation(false)}>No thank you</button>
          </div>
        </div>

        {/* save button */}
        <button className="save-dream-button" onClick={handleSave}>Save</button>
      </main>
    </div>
  )
}

export default NewDream