import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement} from "chart.js";
import { Pie, Bar } from "react-chartjs-2";
import "../styling/Analytics.css";

// Register Chart.js components
ChartJS.register( ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement)

function Analytics() {
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

// getting analytics
  useEffect(() => {
    let ignore = false;
    const loadAnalytics = async () => {
      try {
        const auth = sessionStorage.getItem("auth");
        if (!auth) {
          navigate("/");
          return
        }

        const response = await fetch("http://localhost:3000/analytics",{
            method: "GET",
            headers: {
              Authorization: auth
            }
          }
        )
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Unable to load analytics")
        }

        if (!ignore) {
          setAnalytics(data);
          setError("");
        }

      } catch (error) {
        console.error( "Error loading analytics:", error)

        if (!ignore) {
          setError("Unable to load your analytics.")
        }

      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    loadAnalytics();

    return () => {
      ignore = true;
    };

  }, [navigate]);


// loading state
  if (loading) {
    return (
      <div className="analytics-page">

        <header className="analytics-header">
          <h1>Dream Journal</h1>
        </header>

        <main className="analytics-container">
          <p>Loading your analytics...</p>
        </main>

      </div>
    );
  }

  if (error) {
    return (
      <div className="analytics-page">

        <header className="analytics-header">
          <h1>Dream Journal</h1>
        </header>

        <main className="analytics-container">

          <p className="analytics-error">
            {error}
          </p>

          <button
            onClick={() => navigate("/home")}
          >
            Back to Home
          </button>

        </main>

      </div>
    );
  }



  const moods = analytics?.moods || {};
  const themes = analytics?.themes || {};
  const symbols = analytics?.symbols || {};
  const moodLabels = Object.keys(moods);
  const moodValues = Object.values(moods);
  const themeLabels = Object.keys(themes);
  const themeValues = Object.values(themes);
  const symbolLabels = Object.keys(symbols);
  const symbolValues = Object.values(symbols);
  const mostCommonMood = moodLabels.length > 0? moodLabels.reduce((a, b) =>moods[a] > moods[b] ? a : b): "None";
  const mostCommonTheme =themeLabels.length > 0? themeLabels.reduce((a, b) =>themes[a] > themes[b] ? a : b): "None";
  const mostCommonSymbol = symbolLabels.length > 0? symbolLabels.reduce((a, b) =>symbols[a] > symbols[b] ? a : b): "None";
// mood pie chart
  const moodChartData = {
    labels: moodLabels,
    datasets: [
      {
        label: "Dreams by Mood",
        data: moodValues,
        backgroundColor: [ "#8b6fa8", "#b58fc7", "#6f547f", "#c7a8d8", "#594365", "#9c82b5",],
        borderColor: "#211b29",
        borderWidth: 2,
      },
    ],
  };

  const themeChartData = {
    labels: themeLabels,
    datasets: [
      {
        label: "Themes",
        data: themeValues,
        backgroundColor: "#8b6fa8",
        borderColor: "#8b6fa8",
        borderWidth: 1,
        borderRadius: 6,
      },
    ],
  };


  const themeChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#d8cce0",
        },
        grid: {
          color: "rgba(255,255,255,0.05)",
        },
      },

      y: {
        beginAtZero: true,
        ticks: {
          color: "#d8cce0",
          stepSize: 1,
        },
        grid: {
          color: "rgba(255,255,255,0.05)",
        },
      },
    },
  };


// symbole pie chart
  const symbolChartData = {
    labels: symbolLabels,
    datasets: [
      {
        label: "Symbols",
        data: symbolValues,
        backgroundColor: "#b58fc7",
        borderColor: "#b58fc7",
        borderWidth: 1,
        borderRadius: 6,
      },
    ],
  };


  const symbolChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#d8cce0",
        },
        grid: {
          color: "rgba(255,255,255,0.05)",
        },
      },

      y: {
        beginAtZero: true,
        ticks: {
          color: "#d8cce0",
          stepSize: 1,
        },
        grid: {
          color: "rgba(255,255,255,0.05)",
        },
      },
    },
  };


  return (
    <div className="analytics-page">
      <header className="analytics-header">
        <h1>Dream Journal</h1>
        <button className="back-journal-button" onClick={() => navigate("/journal")}>
          My Journal
        </button>
      </header>

      <main className="analytics-container">
        <h2>Dream Analytics</h2>
        <p className="analytics-intro"> Discover patterns and recurring themes from your dreams.</p>
        <section className="analytics-summary">
          <div className="analytics-card">

            <h3>Total Dreams</h3>

            <p className="analytics-number"> {analytics.totalDreams}</p>
          </div>

          <div className="analytics-card">
            <h3>Most Common Mood</h3>
            <p className="analytics-highlight">{mostCommonMood}</p>
          </div>

          <div className="analytics-card">
            <h3>Top Theme</h3>
            <p className="analytics-highlight">{mostCommonTheme}</p>
          </div>
          <div className="analytics-card">

            <h3>Top Symbol</h3>
            <p className="analytics-highlight">{mostCommonSymbol}</p>
          </div>
        </section>

        <section className="analytics-charts">
          <div className="chart-card">
            <h3>Moods</h3>
            {moodLabels.length > 0 ? (
              <div className="pie-chart-container">
                <Pie data={moodChartData} options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: "bottom",
                        labels: {
                          color: "#d8cce0",
                          padding: 15,
                        },
                      },
                    },
                  }}
                />
              </div>
            ) : (
              <p className="no-data">No mood data yet.</p>
            )}
          </div>
          <div className="chart-card">
            <h3>Recurring Themes</h3>
            {themeLabels.length > 0 ? (
              <div className="bar-chart-container">
                <Bar data={themeChartData} options={themeChartOptions}/>
              </div>
            ) : (

              <p className="no-data"> No theme data yet.</p>
            )}
          </div>
          <div className="chart-card full-chart">
            <h3>Recurring Symbols</h3>
            {symbolLabels.length > 0 ? (
              <div className="bar-chart-container">
                <Bar data={symbolChartData} options={symbolChartOptions}/>
              </div>
            ) : (
              <p className="no-data">No symbol data yet.</p>
            )}
          </div>
        </section>
      </main>
      <Navbar />
    </div>
  )
}
export default Analytics