import type { AnalysisResult, ViewMode } from "../types/health";

interface CurrentReportPanelProps {
  result: AnalysisResult;
  mode: ViewMode;
}

export default function CurrentReportPanel({ result, mode }: CurrentReportPanelProps) {
  return (
    <div className="panel analysis-panel">
      <div className="panel-header">
        <div>
          <h3>Report Analysis</h3>
          <p className="panel-copy">Key findings and personalized interpretation for your latest report.</p>
        </div>
        <span className={`mode-pill ${mode === "eli5" ? "mode-eli5" : "mode-detailed"}`}>
          {mode === "eli5" ? "ELI5" : "Detailed"}
        </span>
      </div>

      <div className="summary-grid">
        {result.summary.map((item, idx) => (
          <div key={`${item}-${idx}`} className="summary-card">
            <p>{item}</p>
          </div>
        ))}
      </div>

      <div className={`explanation-block ${mode === "eli5" ? "explanation-eli5" : ""}`}>
        <div className="explanation-icon">💡</div>
        <div>
          <h4>{mode === "detailed" ? "Detailed Medical Explanation" : "Simplified Summary"}</h4>
          <p>{mode === "detailed" ? result.detailedExplanation : result.simplifiedSummary}</p>
        </div>
      </div>
    </div>
  );
}
