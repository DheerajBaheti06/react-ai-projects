// Simple in-memory cache
const cache = new Map();

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  // Parse request body
  const { amount, from, to, convertedAmount } = req.body || {};

  // Defaults to prevent "undefined" in prompt/cache
  const safeAmount = amount || 1;
  const safeConverted = convertedAmount || "1000";

  if (typeof from !== "string" || typeof to !== "string") {
    return res.status(400).json({ error: "Missing currency data" });
  }

  // Generate Cache Key
  const cacheKey = `v1-${from}-${to}-${safeAmount}`;

  // Check Cache (Zero Latency)
  if (cache.has(cacheKey)) {
    console.log("backend :- already available in cache, serving from cache from cache :-",cache.get(cacheKey));
    
    return res.status(200).json({ result: cache.get(cacheKey) });
  }

  // Validate API key
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "GEMINI_API_KEY not configured" });
  }

  // Construct prompt for the AI
  const prompt = `Act as a local travel expert for ${safeAmount} ${from} → ${safeConverted} ${to}.

Return a strict JSON (no markdown) with:

{
  "headline": "3-5 word catchy summary",
  "buy": "1 short sentence: what this amount buys",
  "tip": "1 short sentence: cultural or money tip",
  "safety": {
    "score": "1-10",
    "note": "1 short sentence safety advice"
  },
  "weather": {
    "forecast": "1 short sentence weather advice",
    "condition": "usually sunny/moderate/humid/rainy"
  },
  "must_things": {
    "foods": ["food1", "food2", "food3"],
    "places": ["place1", "place2", "place3"]
  }
}

Keep everything short, fast to read, and valid JSON only.`;

  // Call Gemini API with fallback for redundancy
  // Primary: gemini-2.5-flash-preview (New features)
  // Backup: gemini-1.5-flash (Stable)

  const payload = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: { responseMimeType: "application/json" },
  };

  try {
    console.log("Trying primary: gemini-2.5-flash-preview-09-2025");
    const text = await callGemini(
      "gemini-2.5-flash-preview-09-2025",
      apiKey,
      payload
    );

    // Save to Cache
    cache.set(cacheKey, text);

    return res.status(200).json({ result: text });
  } catch (primaryError) {
    console.warn(`Primary failed with status: ${primaryError.status}`);

    // Fallback for ANY error (Network, 404, 429, 500)
    console.warn("Switching to backup model...");
    try {
      console.log("Trying backup: gemini-1.5-flash");
      const text = await callGemini("gemini-1.5-flash", apiKey, payload);

      // Save to Cache
      cache.set(cacheKey, text);

      return res.status(200).json({ result: text });
    } catch (backupError) {
      console.error("Backup failed:", backupError.body || backupError.message);
    }

    return res
      .status(500)
      .json({ error: "AI service temporarily unavailable" });
  }
}

// Helper function to call specific Gemini model
async function callGemini(model, apiKey, payload) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    const error = new Error(`Model ${model} failed`);
    error.status = response.status;
    error.body = errorText;
    throw error;
  }

  const data = await response.json();
  return data?.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
}
