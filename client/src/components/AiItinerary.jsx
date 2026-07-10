import { useState } from "react";
import { generateItinerary as fetchItinerary } from "../api/itineraryApi";
import "./AiItinerary.css";

const AiItinerary = ({ from, to }) => {
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generateItinerary = async () => {
    if (!from || !to) return;

    setLoading(true);
    setError("");
    setItinerary(null);

    try {
      const data = await fetchItinerary(from, to);
      setItinerary(data);
    } catch (err) {
      setError(
        err.response?.data?.error ||
          err.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-itinerary card-surface">
      <div className="ai-itinerary-header">
        <div>
          <h3>AI Trip Itinerary</h3>
          <p className="ai-itinerary-sub">
            Powered by Groq — a personalised day-by-day plan for {from} → {to}
          </p>
        </div>

        <button
          className="btn btn-primary"
          onClick={generateItinerary}
          disabled={loading}
        >
          {loading
            ? "Planning..."
            : itinerary
            ? "Regenerate"
            : "✨ Generate Itinerary"}
        </button>
      </div>

      {error && <p className="error-text ai-itinerary-error">{error}</p>}

      {loading && (
        <div className="ai-itinerary-loading">
          <div className="spinner"></div>
          <p>Groq is planning your perfect trip…</p>
        </div>
      )}

      {!loading && itinerary && itinerary.length > 0 && (
        <div className="ai-days">
          {itinerary.map((day, i) => (
            <div key={i} className="ai-day">
              <h4>{day.title}</h4>
              <ul>
                {day.items.map((item, j) => (
                  <li key={j}>{item.replace(/^[•\-]\s*/, "")}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AiItinerary;
