import { useState, type FormEvent } from "react";
import UploadForm from "./components/UploadForm";
import ResultsTabs from "./components/ResultsTabs";
import CurrentReportPanel from "./components/CurrentReportPanel";
import ComparisonPanel from "./components/ComparisonPanel";
import DietPlanPanel from "./components/DietPlanPanel";
import { sampleCurrentData, samplePreviousData } from "./constants/sampleData";
import { analyzeReport } from "./services/reportApi";
import type { ActiveTab, AnalysisResult, ReportFormState, ViewMode } from "./types/health";

const defaultFormState: ReportFormState = {
  currentFile: null,
  previousFiles: [],
  currentText: "",
  previousText: "",
  currentStructuredData: "",
  previousStructuredData: ""
};

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("Current Report");
  const [mode, setMode] = useState<ViewMode>("detailed");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string>("");
  const [formState, setFormState] = useState<ReportFormState>(defaultFormState);

  const loadSampleData = () => {
    setFormState((prev) => ({
      ...prev,
      currentStructuredData: JSON.stringify(sampleCurrentData, null, 2),
      previousStructuredData: JSON.stringify(samplePreviousData, null, 2),
      currentText: "Sample text: LDL elevated, Vitamin D low, ALT mildly elevated.",
      previousText: "Sample text (2025): Higher cholesterol and lower vitamin D."
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const data = await analyzeReport(formState);
      setResult(data);
      setActiveTab("Current Report");
    } catch (submitError) {
      const message = submitError instanceof Error ? submitError.message : "Unexpected error";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page">
      <header className="hero">
        <h1>LifeMetrics AI</h1>
        <p>
          Upload current and past health reports to get doctor-style explanations, trend insights,
          and personalized diet suggestions.
        </p>
      </header>

      <UploadForm
        formState={formState}
        onChange={(updates) => setFormState((prev) => ({ ...prev, ...updates }))}
        onSubmit={handleSubmit}
        onLoadSampleData={loadSampleData}
        isLoading={isLoading}
      />

      {error ? <p className="error">{error}</p> : null}

      <section className="card">
        <ResultsTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          mode={mode}
          onModeChange={setMode}
        />

        {!result ? <p>Submit a report to see analysis results.</p> : null}

        {result && activeTab === "Current Report" ? (
          <CurrentReportPanel result={result} mode={mode} />
        ) : null}
        {result && activeTab === "Comparison" ? (
          <ComparisonPanel comparison={result.comparison ?? []} />
        ) : null}
        {result && activeTab === "Diet Plan" ? <DietPlanPanel dietPlan={result.dietPlan} /> : null}
      </section>
    </div>
  );
}
