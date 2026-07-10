import express from "express";

const router = express.Router();

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = "llama-3.3-70b-versatile";

// POST /api/itinerary
// body: { from: string, to: string }
router.post("/", async (req, res) => {
  const { from, to } = req.body;

  if (!from || !to) {
    return res.status(400).json({ error: "Both 'from' and 'to' are required" });
  }

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
    const groqRes = await fetch(GROQ_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 1200,
      }),
    });

    if (!groqRes.ok) {
      const errData = await groqRes.json();
      return res.status(groqRes.status).json({
        error: errData.error?.message || "Groq API request failed",
      });
    }

    const data = await groqRes.json();
    const rawText = data.choices?.[0]?.message?.content;

    if (!rawText) {
      return res.status(502).json({ error: "Groq returned an empty response" });
    }

    // strip any leftover markdown formatting just in case
    const cleaned = rawText
      .replace(/\*\*/g, "")
      .replace(/\*/g, "")
      .replace(/^#{1,6}\s/gm, "")
      .trim();

    // split the response into day blocks — same parsing logic as before,
    // now done server-side so the client just receives clean structured data
    const dayBlocks = cleaned
      .split(/\n(?=Day \d)/i)
      .map((block) => {
        const lines = block.split("\n").map((l) => l.trim()).filter(Boolean);
        const title = lines[0];
        const items = lines.slice(1).filter((l) => l.startsWith("•") || l.startsWith("-"));
        return { title, items };
      })
      .filter((d) => d.items.length > 0);

    return res.json({ itinerary: dayBlocks });
  } catch (err) {
    console.error("Itinerary generation error:", err);
    return res.status(500).json({ error: "Something went wrong generating the itinerary" });
  }
});

export default router;
