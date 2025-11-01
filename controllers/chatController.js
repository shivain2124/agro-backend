// controllers/chatController.js
import "dotenv/config";
import SoilSample from "../models/SoilSample.js";
import Crop from "../models/Crop.js";
import OpenAI from "openai";

// Initialize Grok client
const grok = new OpenAI({
  apiKey: process.env.GROK_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

function buildFieldAdvice(sample, crops) {
  if (!sample) {
    return "No soil samples found yet for your account. Please submit one and ask me again.";
  }

  const { N, P, K, latitude, longitude, timestamp } = sample;

  // Filter crops that match current NPK levels
  const recCrops = crops
    .filter(
      (c) =>
        N >= c.N_min &&
        N <= c.N_max &&
        P >= c.P_min &&
        P <= c.P_max &&
        K >= c.K_min &&
        K <= c.K_max
    )
    .map((c) => c.crop);

  // Identify deficiencies
  const deficiencies = [];
  if (N < 20) deficiencies.push("Nitrogen");
  if (P < 10) deficiencies.push("Phosphorus");
  if (K < 15) deficiencies.push("Potassium");

  // Fertilizer recommendations
  const fert = {
    Nitrogen: "Urea / Ammonium Nitrate",
    Phosphorus: "DAP / SSP",
    Potassium: "MOP (Muriate of Potash)",
  };

  // Build summary
  let summary = `Latest sample @ ${new Date(
    timestamp
  ).toLocaleString()} (${latitude}, ${longitude}). N=${N}, P=${P}, K=${K}. `;

  if (deficiencies.length) {
    summary +=
      `Deficiencies: ${deficiencies.join(", ")}. Fertilizer tips: ` +
      deficiencies.map((d) => `${d}: ${fert[d]}`).join(" | ") +
      ". ";
  } else {
    summary += `NPK looks balanced. `;
  }

  summary += recCrops.length
    ? `Suitable crops now: ${recCrops.slice(0, 6).join(", ")}.`
    : `No perfect crop match; consider correcting deficiencies first.`;

  return summary;
}

// Main chat handler
export const chatAsk = async (req, res) => {
  try {
    const userId = req.userId; // from authenticate middleware
    const message = (req.body?.message || "").trim();

    if (!message) {
      return res.status(400).json({
        success: false,
        reply: "Please provide a message.",
      });
    }

    // Fetch grounding data
    const [latestSample] = await SoilSample.find({ user: userId })
      .sort({ timestamp: -1 })
      .limit(1)
      .lean();

    const crops = await Crop.find({}).lean();
    const fieldAdvice = buildFieldAdvice(latestSample, crops);

    // Build content for Grok
    const content = [
      {
        type: "text",
        text: `User message: "${message}"

Context:
${fieldAdvice}

Task: Answer helpfully for a farmer in 2–6 sentences. Focus on practical soil management advice. If an image is included, analyze it and provide insights. If specific actions are needed, be very specific.`,
      },
    ];

    // Add image if uploaded
    if (req.file) {
      const b64 = req.file.buffer.toString("base64");
      const dataUrl = `data:${req.file.mimetype};base64,${b64}`;
      content.push({
        type: "image_url",
        image_url: { url: dataUrl },
      });
    }

    // Call Grok API
    const response = await grok.chat.completions.create({
      model: "meta-llama/llama-4-scout-17b-16e-instruct", // Grok model with vision capability
      messages: [
        {
          role: "user",
          content: content,
        },
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    const reply =
      response.choices[0]?.message?.content ||
      "Sorry, I couldn't generate a response. Please try again.";

    return res.json({
      success: true,
      reply,
    });
  } catch (err) {
    console.error("Chat error:", {
      message: err.message,
      status: err.response?.status,
      data: err.response?.data,
    });

    res.status(500).json({
      success: false,
      reply: "Chat service error. Please try again later.",
    });
  }
};
