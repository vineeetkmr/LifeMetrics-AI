import type { FormEvent } from "react";
import type { ReportFormState } from "../types/health";
import "./UploadForm.css";

interface UploadFormProps {
  formState: ReportFormState;
  onChange: (updates: Partial<ReportFormState>) => void;
  onAnalyzeClick: (event: FormEvent<HTMLFormElement>) => void;
  onLoadSampleData: () => void;
  isLoading: boolean;
}

export default function UploadForm({
  formState,
  onChange,
  onAnalyzeClick,
  onLoadSampleData,
  isLoading
}: UploadFormProps) {
  return (
    <section className="card">
      <form onSubmit={onAnalyzeClick} className="upload-form">
        <fieldset style={{ gridColumn: "1 / -1", border: "1px solid #cbd5e1", borderRadius: "14px", padding: "1rem", backgroundColor: "#f8fafc", margin: "0" }}>
          <legend style={{ padding: "0 8px", fontWeight: 600, color: "#334155", fontSize: "0.9rem" }}>Patient Demographics (Optional)</legend>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: "120px" }}>
              <label>Age</label>
              <input
                type="number"
                value={formState.age}
                onChange={(event) => onChange({ age: event.target.value })}
                placeholder="e.g. 35"
                min="0"
              />
            </div>
            <div style={{ flex: 1, minWidth: "120px" }}>
              <label>Height (in CM)</label>
              <input
                type="number"
                step="any"
                value={formState.height}
                onChange={(event) => onChange({ height: event.target.value })}
                placeholder="e.g. 168.5"
                min="0"
              />
            </div>
            <div style={{ flex: 1, minWidth: "120px" }}>
              <label>Weight (kg)</label>
              <input
                type="number"
                step="any"
                value={formState.weight}
                onChange={(event) => onChange({ weight: event.target.value })}
                placeholder="e.g. 69.4"
                min="0"
              />
            </div>
          </div>
        </fieldset>
        <div>
          <label>Current Report Upload (PDF/TXT)</label>
          <input
            type="file"
            accept=".pdf,.txt,.json"
            onChange={(event) => onChange({ currentFile: event.target.files?.[0] ?? null })}
          />
        </div>
        <div>
          <label>Previous Report Upload</label>
          <input
            type="file"
            accept=".pdf,.txt,.json"
            onChange={(event) => onChange({ previousFiles: event.target.files ? [event.target.files[0]] : [] })}
          />
        </div>
        <br></br>
        <div>
          <label>Current Report (paste text)</label>
          <textarea
            rows={4}
            value={formState.currentText}
            onChange={(event) => onChange({ currentText: event.target.value })}
            placeholder="Paste current report details..."
          />
        </div>
        <div>
          <label>Previous Report (paste text)</label>
          <textarea
            rows={4}
            value={formState.previousText}
            onChange={(event) => onChange({ previousText: event.target.value })}
            placeholder="Paste Previous Report..."
          />
        </div>
        <div style={{ display: "none" }}>
          <label>Current Structured Data (JSON)</label>
          <textarea
            rows={6}
            value={formState.currentStructuredData}
            onChange={(event) => onChange({ currentStructuredData: event.target.value })}
            placeholder='{"metrics":{"ldl":130,"vitaminD":19}}'
          />
        </div>
        <div style={{ display: "none" }}>
          <label>Previous Structured Data (JSON)</label>
          <textarea
            rows={6}
            value={formState.previousStructuredData}
            onChange={(event) => onChange({ previousStructuredData: event.target.value })}
            placeholder='{"metrics":{"ldl":145,"vitaminD":16}}'
          />
        </div>

        <div className="actions">
          <button type="button" className="secondary" onClick={onLoadSampleData}>
            Load Sample Reports
          </button>
          <button type="submit" className="primary" disabled={isLoading}>
            {isLoading ? "Analyzing..." : "Analyze Report"}
          </button>
        </div>
      </form>
    </section>
  );
}
