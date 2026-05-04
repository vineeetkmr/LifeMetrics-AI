import type { AnalysisResult, ReportFormState } from "../types/health";

export async function analyzeReport(formState: ReportFormState): Promise<AnalysisResult> {
  const formData = new FormData();
  const {
    currentFile,
    previousFiles,
    currentText,
    previousText,
    currentStructuredData,
    previousStructuredData
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

  const response = await fetch("https://life-metrics-ai-backend.vercel.app/api/analyze-report", {
    method: "POST",
    body: formData
  });

  const data = (await response.json()) as AnalysisResult & { error?: string };
  if (!response.ok) {
    throw new Error(data.error || "Failed to analyze report");
  }

  return data;
}
