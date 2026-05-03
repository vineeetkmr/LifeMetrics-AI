# LifeMetrics-AI

Demo-ready web app to upload or paste health reports, analyze findings with AI, compare trends across years, and generate diet recommendations (including vegetarian options).

## Stack

- Frontend: React + TypeScript + Vite + Recharts
- Backend: Node.js + Express + OpenAI API

## Features

- Upload current and previous reports (`.pdf`, `.txt`, `.json`)
- Paste raw report text or structured JSON data
- AI-generated:
  - Summary of key health metrics
  - Detailed doctor-style explanation
  - Simplified ELI5 explanation
  - Diet plan with vegetarian options
- Comparison dashboard:
  - Bar chart (previous vs current)
  - Line chart (change percentage)
  - Highlights per metric (improved/declined)
- Tabs: `Current Report`, `Comparison`, `Diet Plan`

## Setup

1. Install dependencies:

```bash
npm install
```

2. Configure environment:
- Copy `backend/.env.example` to `backend/.env`
- Add your `OPENAI_API_KEY`

3. Run dev mode:

```bash
npm run dev
```

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:4000`

## API

### `POST /api/analyze-report`

Multipart form fields:
- `currentReportFile` (single file)
- `previousReportFile` (multiple files)
- `currentPastedText` (string)
- `previousPastedText` (string)
- `currentStructuredData` (JSON string)
- `previousStructuredData` (JSON string)

Response JSON includes:
- `summary`
- `detailedExplanation`
- `simplifiedSummary`
- `comparison`
- `dietPlan`

## AI System Prompt Used

```text
You are an AI assistant specialized in analyzing health reports.
Your role is to:
- Accept raw health report data (lab values, test results).
- Identify key findings and explain them in plain English.
- Compare current report with previous reports to highlight improvements or declines.
- Suggest evidence-based diet plans tailored to the findings (vegetarian options included).
- Format responses with:
   1. Summary of report
   2. Detailed explanation
   3. Comparison insights (if previous reports are provided)
   4. Suggested diet plan
```

## Notes

- If `OPENAI_API_KEY` is missing, backend returns demo output so the UI remains testable.
- Sample test reports are included in `samples/`.
