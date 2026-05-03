import type { AnalysisResult, ViewMode } from "../types/health";

interface CurrentReportPanelProps {
  result: AnalysisResult;
  mode: ViewMode;
}

export default function CurrentReportPanel({ result, mode }: CurrentReportPanelProps) {
  return (
    <div className="panel">
      <h3>Summary of Key Health Metrics</h3>
      <ul>
        {result.summary.map((line, idx) => (
          <li key={`${line}-${idx}`}>{line}</li>
        ))}
      </ul>
      <h3>{mode === "detailed" ? "Detailed Medical Explanation" : "Simplified Summary"}</h3>
      <p>{mode === "detailed" ? result.detailedExplanation : result.simplifiedSummary}</p>
    </div>
  );
}
