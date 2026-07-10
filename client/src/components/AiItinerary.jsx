import { useState } from "react";
import "./AiItinerary.css";

// the API key lives in the client .env (VITE_GEMINI_API_KEY)
// this is fine for a portfolio project — in production you'd proxy through your backend
const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

const AiItinerary = ({ from, to }) => {
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generateItinerary = async () => {
    if (!from || !to) return;

    setLoading(true);
    setError("");
    setItinerary(null);

    const prompt = `Create a detailed 3-day trip itinerary for a trip from ${from} to ${to} in India.

Return ONLY a plain text response formatted exactly like this — no markdown, no asterisks, no hashtags:

Day 1
• 7:00 AM - Description of activity
• 9:00 AM - Breakfast at [specific local restaurant name]
• 11:00 AM - Visit [specific attraction]
• 1:00 PM - Lunch at [local restaurant]
• 3:00 PM - Activity
• 6:00 PM - Evening activity
• 8:00 PM - Dinner at [restaurant]
• Hotel Check-in

Day 2
(follow same format)

Day 3
(follow same format, end with departure)

Rules:
- Name specific local restaurants, dhabas or cafes (not generic ones)
- Name specific tourist spots, viewpoints, markets, temples
- Include local food to try and small travel tips
- Make timings realistic for India (account for travel time between spots)
- Keep each bullet concise — one line only`;

    try {
      const res = await fetch(`${GEMINI_URL}?key=${import.meta.env.VITE_GEMINI_API_KEY}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1200,
          },
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error?.message || "Gemini API request failed");
      }

      const data = await res.json();
      const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!rawText) throw new Error("Gemini returned an empty response");

      // strip any leftover markdown formatting just in case
      const cleaned = rawText
        .replace(/\*\*/g, "")
        .replace(/\*/g, "")
        .replace(/^#{1,6}\s/gm, "")
        .trim();

      // split the response into day blocks
      const dayBlocks = cleaned
        .split(/\n(?=Day \d)/i)
        .map((block) => {
          const lines = block.split("\n").map((l) => l.trim()).filter(Boolean);
          const title = lines[0];
          const items = lines.slice(1).filter((l) => l.startsWith("•") || l.startsWith("-"));
          return { title, items };
        })
        .filter((d) => d.items.length > 0);

      setItinerary(dayBlocks);
    } catch (err) {
      setError(err.message || "Something went wrong. Check your Gemini API key in .env");
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
            Powered by Gemini — a personalised day-by-day plan for {from} → {to}
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
          <p>Gemini is planning your perfect trip…</p>
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
