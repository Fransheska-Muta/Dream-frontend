import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styling/Journal.css";
import Navbar from "../components/Navbar";

function Journal() {
  const navigate = useNavigate();
  const [dreams, setDreams] = useState([]);
  const [interpretations, setInterpretations] = useState([]);
  const [selectedDream, setSelectedDream] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

useEffect(() => {
  let ignore = false;

  const loadJournal = async () => {
    try {
      const auth = sessionStorage.getItem("auth");
      if (!auth) {
        navigate("/");
        return
      }

      // Get dreams and interpretations at the same time
      const [dreamsResponse, interpretationsResponse] =
        await Promise.all([fetch("http://localhost:3000/dreams", {
            method: "GET",
            headers: {
              Authorization: auth,
            },
          }),

          fetch("http://localhost:3000/interpretations", {
            method: "GET",
            headers: {
              Authorization: auth,
            },
          }),
        ]);

      const dreamsData = await dreamsResponse.json();
      const interpretationsData = await interpretationsResponse.json();
      if (!dreamsResponse.ok) {
        throw new Error(dreamsData.message || "Unable to load dreams")
      }

      if (!interpretationsResponse.ok) {
        throw new Error(interpretationsData.message || "Unable to load interpretations"
        )
      }

      // Prevent state updates if component has been removed
      if (!ignore) {
        setDreams(dreamsData);
        setInterpretations(interpretationsData);
        setError("");
      }

    } catch (error) {
      console.error(
        "Error loading journal:",
        error
      );

      if (!ignore) {
        setError("Unable to load your journal.");
      }

    } finally {
      if (!ignore) {
        setLoading(false);
      }
    }
  };

  loadJournal();

  return () => {
    ignore = true;
  };

}, [navigate]);
// finding  the interprtetation
  const getInterpretation = (dreamId) => {
    return interpretations.find(
      (interpretation) =>
        interpretation.dreamId === dreamId ||
        interpretation.dreamId?.toString() === dreamId
    );
  };

  const openDream = (dream) => {setSelectedDream(dream)}
  const closeDream = () => {setSelectedDream(null)}

  const deleteDream = async (dreamId) => {
    const confirmed = window.confirm("Are you sure you want to delete this dream?")
    if (!confirmed) {
      return
    }

    try {
      const auth = sessionStorage.getItem("auth");
      const response = await fetch(`http://localhost:3000/dreams/${dreamId}`,{
          method: "DELETE",
          headers: {
            Authorization: auth,
          },
        }
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(
          data.message || "Unable to delete dream"
        )
      }

      // Remove dream from Journal
      setDreams((currentDreams) =>
        currentDreams.filter(
          (dream) => dream._id !== dreamId
        )
      );

      // Remove connected interpretation
      setInterpretations((currentInterpretations) =>
        currentInterpretations.filter(
          (interpretation) =>
            interpretation.dreamId !== dreamId &&
            interpretation.dreamId?.toString() !== dreamId
        )
      );

      // Close modal
      setSelectedDream(null);
      alert("Dream deleted successfully.");
    } catch (error) {
      console.error(
        "Error deleting dream:",
        error
      );
      alert("Unable to delete dream.");
    }
  };


  return (
    <div className="journal-page">
      <header className="journal-header">
        <h1>Dream Journal</h1>
      </header>

      <main className="journal-container">
        <h2>My Journal</h2>
        {loading && (
          <p>Loading your dreams...</p>
        )}

        {error && (
          <p className="journal-error">
            {error}
          </p>
        )}
        {!loading && !error && dreams.length === 0 && (
            <div className="empty-journal">
              <h3>No dreams recorded yet</h3>
              <p>Your dreams will appear here.</p>

              <button onClick={() =>navigate("/new-dream")}>
                Record a Dream
              </button>

            </div>
          )}

        <div className="dream-list">
          {dreams.map((dream) => (
            <div className="dream-card" key={dream._id} onClick={() => openDream(dream)}>
              <div className="dream-card-header">
                <h3>{dream.description ? dream.description .split(/\s+/) .slice(0, 3) .join(" ") + "...": "Untitled Dream"}</h3>
                <span className="dream-mood">{dream.mood || "Neutral"}</span>
              </div>

              <p className="dream-date">{new Date(dream.dreamDate).toLocaleDateString()}</p>
              <p className="dream-description">{dream.description}</p>

              <p className="click-dream"> Click to view dream</p>
            </div>

          ))}

        </div>

      </main>
      {selectedDream && (

        <div className="dream-modal-overlay" onClick={closeDream}>
          <div className="dream-modal" onClick={(event) =>
              event.stopPropagation()
            }
          >
            <button className="close-modal" onClick={closeDream}>
              x
            </button>
            <h2>
              {selectedDream.description
                ? selectedDream.description
                    .split(/\s+/)
                    .slice(0, 3)
                    .join(" ") + "..."
                : "Untitled Dream"}
            </h2>

            <p className="modal-date">
              {new Date(selectedDream.dreamDate).toLocaleDateString(undefined,{
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                }
              )}
            </p>

            <div className="modal-mood">
              <strong>Mood after waking:</strong>
              <span>
                {selectedDream.mood || "Neutral"}
              </span>
            </div>
            <div className="modal-divider"></div>
            <section className="modal-section">

              <h3>your Dream</h3>
              <p className="modal-dream-text">
                {selectedDream.description}
              </p>
            </section>

            {getInterpretation(selectedDream._id) && (
              <>
                <div className="modal-divider"></div>
                <section className="modal-section">
                  <h3>  AI Interpretation</h3>
                  <p className="modal-interpretation">{
                      getInterpretation(selectedDream._id).interpretation
                    }
                  </p>

                  {getInterpretation(selectedDream._id).themes?.length > 0 && (
                    <div className="modal-tags">
                      <h4>Themes</h4>
                      <div className="tags">
                        {getInterpretation(
                          selectedDream._id
                        ).themes.map(
                          (theme, index) => (
                            <span key={index}>
                              {theme}
                            </span>
                          )
                        )}
                      </div>
                    </div>
                  )}
                  {getInterpretation(
                    selectedDream._id
                  ).symbols?.length > 0 && (
                    <div className="modal-tags">
                      <h4>Symbols</h4>
                      <div className="tags">
                        {getInterpretation(
                          selectedDream._id
                        ).symbols.map(
                          (symbol, index) => (
                            <span key={index}>
                              {symbol}
                            </span>
                          )
                        )}
                      </div>
                    </div>
                  )}
                </section>
              </>
            )}

            {!getInterpretation(selectedDream._id) && (
              <div className="no-interpretation">
                <p>No AI interpretation has beengenerated for this dream.</p>
              </div>
            )}
            <div className="modal-actions">
              <button className="delete-dream-button" onClick={() =>
                  deleteDream(selectedDream._id)
                }
              >
                Delete Dream
              </button>
            </div>
          </div>
        </div>
      )}
      <Navbar />
    </div>
  )
}
export default Journal