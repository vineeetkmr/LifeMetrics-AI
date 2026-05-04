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
        <div>
          <label>Current Report Upload (PDF/TXT)</label>
          <input
            type="file"
            accept=".pdf,.txt,.json"
            onChange={(event) => onChange({ currentFile: event.target.files?.[0] ?? null })}
          />
        </div>
        <div>
          <label>Previous Reports Upload</label>
          <input
            type="file"
            accept=".pdf,.txt,.json"
            onChange={(event) => onChange({ previousFiles: event.target.files ? [event.target.files[0]] : [] })}
          />
        </div>
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
          <label>Previous Reports (paste text)</label>
          <textarea
            rows={4}
            value={formState.previousText}
            onChange={(event) => onChange({ previousText: event.target.value })}
            placeholder="Paste previous reports..."
          />
        </div>
        <div>
          <label>Current Structured Data (JSON)</label>
          <textarea
            rows={6}
            value={formState.currentStructuredData}
            onChange={(event) => onChange({ currentStructuredData: event.target.value })}
            placeholder='{"metrics":{"ldl":130,"vitaminD":19}}'
          />
        </div>
        <div>
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
