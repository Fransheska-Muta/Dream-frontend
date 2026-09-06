import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styling/Journal.css";

function Journal() {
  const navigate = useNavigate();

  const [dreams, setDreams] = useState([]);
  const [interpretations, setInterpretations] = useState([]);
  const [selectedDream, setSelectedDream] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  // =========================
  // GET DREAMS
  // =========================

  const fetchDreams = async () => {
    try {
      const auth = sessionStorage.getItem("auth");

      if (!auth) {
        navigate("/");
        return;
      }

      const response = await fetch("http://localhost:3000/dreams", {
        method: "GET",
        headers: {
          Authorization: auth,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to load dreams");
      }

      setDreams(data);

    } catch (error) {
      console.error("Error fetching dreams:", error);
      setError("Unable to load your dreams.");

    } finally {
      setLoading(false);
    }
    fetchDreams();
  };

  // =========================
  // GET INTERPRETATIONS
  // =========================

  const fetchInterpretations = async () => {
    try {
      const auth = sessionStorage.getItem("auth");

      if (!auth) return;

      const response = await fetch(
        "http://localhost:3000/interpretations",
        {
          method: "GET",
          headers: {
            Authorization: auth,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to load interpretations"
        );
      }

      setInterpretations(data);

    } catch (error) {
      console.error("Error fetching interpretations:", error);
    }
    
    fetchInterpretations()
  };

     useEffect(() => {
    fetchDreams();
    fetchInterpretations();
  }, []);


  // =========================
  // FIND INTERPRETATION
  // =========================

  const getInterpretation = (dreamId) => {
    return interpretations.find(
      (interpretation) =>
        interpretation.dreamId === dreamId ||
        interpretation.dreamId?.toString() === dreamId
    );
  };


  // =========================
  // OPEN MODAL
  // =========================

  const openDream = (dream) => {
    setSelectedDream(dream);
  };


  // =========================
  // CLOSE MODAL
  // =========================

  const closeDream = () => {
    setSelectedDream(null);
  };

  const deleteDream = async (dreamId) => {
  const confirmed = window.confirm(
    "Are you sure you want to delete this dream?"
  );

  if (!confirmed) {
    return;
  }

  try {
    const auth = sessionStorage.getItem("auth");

    const response = await fetch(
      `http://localhost:3000/dreams/${dreamId}`,
      {
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
      );
    }

    // Remove the dream from the screen
    setDreams((currentDreams) =>
      currentDreams.filter(
        (dream) => dream._id !== dreamId
      )
    );

    // Remove its interpretation from the screen too
    setInterpretations((currentInterpretations) =>
      currentInterpretations.filter(
        (interpretation) =>
          interpretation.dreamId !== dreamId &&
          interpretation.dreamId?.toString() !== dreamId
      )
    );

    // Close modal if the deleted dream was open
    setSelectedDream(null);

    alert("Dream deleted successfully.");

  } catch (error) {
    console.error("Error deleting dream:", error);

    alert("Unable to delete dream.");
  }
};


  return (
    <div className="journal-page">

      {/* =========================
          HEADER
      ========================= */}

      <header className="journal-header">
        <h1>Dream Journal</h1>
      </header>


      {/* =========================
          MAIN JOURNAL
      ========================= */}

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

            <p>
              Your recorded dreams will appear here.
            </p>

            <button onClick={() => navigate("/new-dream")}>
              Record a Dream
            </button>

          </div>
        )}


        {/* =========================
            DREAM CARDS
        ========================= */}

        <div className="dream-list">

          {dreams.map((dream) => (

            <div
              className="dream-card"
              key={dream._id}
              onClick={() => openDream(dream)}
            >

              <div className="dream-card-header">

                <h3>
                  {dream.description
                    ? dream.description
                        .split(/\s+/)
                        .slice(0, 3)
                        .join(" ") + "..."
                    : "Untitled Dream"}
                </h3>

                <span className="dream-mood">
                  {dream.mood || "Neutral"}
                </span>

              </div>


              <p className="dream-date">
                {new Date(
                  dream.dreamDate
                ).toLocaleDateString()}
              </p>


              <p className="dream-description">
                {dream.description}
              </p>


              <p className="click-dream">
                Click to view dream
              </p>

            </div>

          ))}

        </div>

      </main>


      {/* ==================================================
          DREAM MODAL
      ================================================== */}

      {selectedDream && (

        <div
          className="dream-modal-overlay"
          onClick={closeDream}
        >

          <div
            className="dream-modal"
            onClick={(event) => event.stopPropagation()}
          >

            {/* CLOSE BUTTON */}

            <button
              className="close-modal"
              onClick={closeDream}
            >
              ×
            </button>


            {/* TITLE */}

            <h2>
              {selectedDream.description
                ? selectedDream.description
                    .split(/\s+/)
                    .slice(0, 3)
                    .join(" ") + "..."
                : "Untitled Dream"}
            </h2>


            {/* DATE */}

            <p className="modal-date">
              {new Date(
                selectedDream.dreamDate
              ).toLocaleDateString(
                undefined,
                {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                }
              )}
            </p>


            {/* MOOD */}

            <div className="modal-mood">

              <strong>
                Mood after waking:
              </strong>

              <span>
                {selectedDream.mood || "Neutral"}
              </span>

            </div>


            <div className="modal-divider"></div>


            {/* DREAM */}

            <section className="modal-section">

              <h3>
                Your Dream
              </h3>

              <p className="modal-dream-text">
                {selectedDream.description}
              </p>

            </section>


            {/* =========================
                INTERPRETATION
            ========================= */}

            {getInterpretation(selectedDream._id) && (

              <>

                <div className="modal-divider"></div>

                <section className="modal-section">

                  <h3>
                    AI Interpretation
                  </h3>

                  <p className="modal-interpretation">
                    {
                      getInterpretation(
                        selectedDream._id
                      ).interpretation
                    }
                  </p>


                  {/* THEMES */}

                  {getInterpretation(
                    selectedDream._id
                  ).themes?.length > 0 && (

                    <div className="modal-tags">

                      <h4>
                        Themes
                      </h4>

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


                  {/* SYMBOLS */}

                  {getInterpretation(
                    selectedDream._id
                  ).symbols?.length > 0 && (

                    <div className="modal-tags">

                      <h4>
                        Symbols
                      </h4>

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

                      <div className="modal-actions">

  <button
    className="delete-dream-button"
    onClick={() => deleteDream(selectedDream._id)}
  >
    Delete Dream
  </button>

</div>

                    </div>

                  )}

                </section>

              </>

            )}


            {/* NO INTERPRETATION */}

            {!getInterpretation(
              selectedDream._id
            ) && (

              <div className="no-interpretation">

                <p>
                  No AI interpretation has been
                  generated for this dream.
                </p>

              </div>

            )}


          </div>

        </div>

      )}

    </div>
  );
}

export default Journal