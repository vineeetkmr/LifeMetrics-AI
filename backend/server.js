import express from "express";
import cors from "cors";
import multer from "multer";
import dotenv from "dotenv";
import OpenAI from "openai";
import pdfParse from "pdf-parse";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, ".env") });

const app = express();
const upload = multer({ storage: multer.memoryStorage() });
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json({ limit: "10mb" }));

const systemPrompt = `You are an AI assistant specialized in analyzing health reports.
Your role is to:
- Accept raw health report data (lab values, test results).
- Identify key findings and explain them in plain English.
- Compare current report with previous reports to highlight improvements or declines.
- Suggest evidence-based diet plans tailored to the findings (vegetarian options included).
- Format responses with:
   1. Summary of report
   2. Detailed explanation
   3. Comparison insights (if previous reports are provided)
   4. Suggested diet plan`;

const demoResponse = {
  summary: [
    "LDL cholesterol is mildly elevated.",
    "Vitamin D has improved from last year but remains below ideal range.",
    "ALT liver enzyme is slightly above normal and should be monitored."
  ],
  detailedExplanation:
    "Your lipid profile shows an LDL level above the recommended target, which can increase long-term cardiovascular risk if persistent. Vitamin D has improved compared with your previous report, which is encouraging, but it remains on the lower side for optimal bone and immune health. ALT is mildly elevated, which may be linked to fatty liver, medication effects, or other reversible causes. Consider discussing repeat testing and risk factor management with your physician.",
  simplifiedSummary:
    "Your bad cholesterol is a bit high, your Vitamin D is getting better but still low, and one liver number is slightly high. Overall, things are improving, but you should keep working on diet, exercise, and follow-up tests.",
  dietPlan: {
    goals: [
      "Reduce LDL cholesterol",
      "Improve Vitamin D status",
      "Support liver health"
    ],
    vegetarianOptions: [
      "Breakfast: Oats with chia seeds, walnuts, and fortified soy milk.",
      "Lunch: Mixed bean salad with olive oil, lemon, and leafy greens.",
      "Snack: Roasted chickpeas with fruit.",
      "Dinner: Grilled tofu, quinoa, and steamed broccoli."
    ],
    generalTips: [
      "Use less fried and ultra-processed foods.",
      "Aim for 25-35g fiber daily.",
      "Get safe sunlight exposure and include fortified foods.",
      "Stay hydrated and limit alcohol."
    ]
  },
  comparison: [
    {
      metric: "Vitamin D",
      previous: 16,
      current: 19.2,
      changePercent: 20.0,
      direction: "improved",
      unit: "ng/mL",
      note: "Improved but still below optimal."
    },
    {
      metric: "Total Cholesterol",
      previous: 230,
      current: 210,
      changePercent: -8.7,
      direction: "improved",
      unit: "mg/dL",
      note: "Reduced from last year."
    },
    {
      metric: "ALT",
      previous: 32,
      current: 41,
      changePercent: 28.1,
      direction: "declined",
      unit: "U/L",
      note: "Slight increase; monitor trend."
    }
  ]
};

function getFallbackResponse(payload) {
  if (payload.vegetarianOnly) {
    return {
      ...demoResponse,
      dietPlan: {
        ...demoResponse.dietPlan,
        vegetarianOptions: [
          "Breakfast: Oats with chia seeds, walnuts, and fortified soy milk.",
          "Lunch: Mixed bean salad with olive oil, lemon, and leafy greens.",
          "Snack: Roasted chickpeas with fruit.",
          "Dinner: Grilled tofu, quinoa, and steamed broccoli."
        ]
      }
    };
  }
  return demoResponse;
}

function extractTextFromUpload(file) {
  if (!file) return "";
  const mime = file.mimetype || "";
  const raw = file.buffer;
  if (mime.includes("pdf")) {
    return pdfParse(raw).then((parsed) => parsed.text || "");
  }
  return Promise.resolve(raw.toString("utf-8"));
}

function parseModelJson(content) {
  if (!content) return null;

  // Gemini can wrap JSON in markdown fences even when JSON is requested.
  const fencedMatch = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  const jsonCandidate = fencedMatch?.[1]?.trim() || content.trim();

  try {
    return JSON.parse(jsonCandidate);
  } catch {
    return null;
  }
}

async function analyzeWithAI(payload) {
  if (!process.env.OPENAI_API_KEY && !process.env.GOOGLE_API_KEY) {
    if (payload.vegetarianOnly) {
      return {
        ...demoResponse,
        dietPlan: {
          ...demoResponse.dietPlan,
          vegetarianOptions: [
            "Breakfast: Oats with chia seeds, walnuts, and fortified soy milk.",
            "Lunch: Mixed bean salad with olive oil, lemon, and leafy greens.",
            "Snack: Roasted chickpeas with fruit.",
            "Dinner: Grilled tofu, quinoa, and steamed broccoli."
          ]
        }
      };
    }
    return demoResponse;
  }

  const client = process.env.GOOGLE_API_KEY
    ? new OpenAI({
        apiKey: process.env.GOOGLE_API_KEY,
        baseURL: "https://generativelanguage.googleapis.com/v1beta/openai"
      })
    : new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const completion = await client.chat.completions.create({
    model: process.env.GOOGLE_API_KEY ? "gemini-2.5-flash" : "gpt-4o-mini",
    temperature: 0.2,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: systemPrompt },
      {
        role: "user",
        content: `Analyze this health report payload and return JSON with keys:
summary (array of strings),
detailedExplanation (string),
simplifiedSummary (string),
comparison (array with metric, previous, current, changePercent, direction, unit, note),
dietPlan (object with goals, vegetarianOptions, generalTips)

Diet preference: ${payload.vegetarianOnly ? "vegetarian only" : "balanced with vegetarian options"}

Payload:
${JSON.stringify(payload, null, 2)}`
      }
    ]
  });

  const content = completion.choices?.[0]?.message?.content;
  return parseModelJson(content) || demoResponse;
}

app.post(
  "/api/analyze-report",
  upload.fields([
    { name: "currentReportFile", maxCount: 1 },
    { name: "previousReportFile", maxCount: 5 }
  ]),
  async (req, res) => {
    try {
      const currentFile = req.files?.currentReportFile?.[0];
      const previousFiles = req.files?.previousReportFile || [];

      const currentReportText = await extractTextFromUpload(currentFile);
      const previousReportTexts = await Promise.all(previousFiles.map(extractTextFromUpload));

      const vegetarianOnly = String(req.body.vegetarianOnly) === "true";

      const payload = {
        currentReportText,
        previousReportTexts,
        currentStructuredData: req.body.currentStructuredData
          ? JSON.parse(req.body.currentStructuredData)
          : null,
        previousStructuredData: req.body.previousStructuredData
          ? JSON.parse(req.body.previousStructuredData)
          : null,
        currentPastedText: req.body.currentPastedText || "",
        previousPastedText: req.body.previousPastedText || "",
        vegetarianOnly
      };

      const result = await analyzeWithAI(payload);
      res.json(result);
    } catch (error) {
      res.status(500).json({
        error: "Failed to analyze report",
        details: error.message
      });
    }
  }
);

app.get("/api/health", (req, res) => {
  res.json({ ok: true, service: "LifeMetrics AI API" });
});

app.listen(port, () => {
  console.log(`Backend running on http://localhost:${port}`);
});
