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
        {result.demographics && (
          <div className="summary-card demographics-card" style={{ gridColumn: "1 / -1", backgroundColor: "#f8fafc", border: "1px solid #cbd5e1" }}>
            <h4 style={{ marginTop: 0, marginBottom: "0.5rem", color: "#0f172a" }}>Patient Profile</h4>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "1.5rem" }}>
              {result.demographics.age && <div><strong>Age:</strong> {result.demographics.age}</div>}
              {result.demographics.height && <div><strong>Height:</strong> {result.demographics.height} cm</div>}
              {result.demographics.weight && <div><strong>Weight:</strong> {result.demographics.weight} kg</div>}
              {result.demographics.bmi && <div><strong>BMI:</strong> {result.demographics.bmi}</div>}
            </div>
          </div>
        )}

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
