import type { AnalysisResult, ReportFormState } from "../types/health";

export async function analyzeReport(
  formState: ReportFormState,
  vegetarianOnly: boolean
): Promise<AnalysisResult> {
  const formData = new FormData();
  const {
    currentFile,
    previousFiles,
    currentText,
    previousText,
    currentStructuredData,
    previousStructuredData,
    age,
    height,
    weight
  } = formState;

  if (currentFile) formData.append("currentReportFile", currentFile);
  previousFiles.forEach((file) => formData.append("previousReportFile", file));
  formData.append("currentPastedText", currentText);
  formData.append("previousPastedText", previousText);

  if (currentStructuredData.trim()) {
    formData.append("currentStructuredData", currentStructuredData);
  }
  if (previousStructuredData.trim()) {
    formData.append("previousStructuredData", previousStructuredData);
  }

  if (age && String(age).trim()) {
    formData.append("age", String(age).trim());
  }
  if (height && String(height).trim()) {
    formData.append("height", String(height).trim());
  }
  if (weight && String(weight).trim()) {
    formData.append("weight", String(weight).trim());
  }

  formData.append("vegetarianOnly", String(vegetarianOnly));

  const response = await fetch("https://life-metrics-ai-backend.vercel.app/api/analyze-report", {
    method: "POST",
    body: formData
  });
  // const response = await fetch("http://localhost:4000/api/analyze-report", {
  //   method: "POST",
  //   body: formData
  // });

  const data = (await response.json()) as AnalysisResult & { error?: string };
  if (!response.ok) {
    throw new Error(data.error || "Failed to analyze report");
  }

  return data;
}
