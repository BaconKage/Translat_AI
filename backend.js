// server.js
import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const LIBRE_URL = "https://libretranslate.de/translate";
// you can swap to another one if this is down:
// const LIBRE_URL = "https://libretranslate.com/translate";

app.post("/translate", async (req, res) => {
  const { q, source, target } = req.body;

  if (!q || !target) {
    return res.status(400).json({ error: "Missing text or target lang" });
  }

  try {
    const r = await fetch(LIBRE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify({
        q,
        source: source || "en",
        target,
        format: "text",
      }),
    });

    const data = await r.json();
    // normalize output
    return res.json({ translatedText: data.translatedText || "" });
  } catch (err) {
    console.error("Backend translate error:", err);
    return res.status(500).json({ error: "Translation failed" });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log("Translation backend running on http://localhost:" + PORT);
});
