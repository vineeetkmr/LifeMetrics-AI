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
  const [activeTab, setActiveTab] = useState<ActiveTab>("Upload");
  const [mode, setMode] = useState<ViewMode>("detailed");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string>("");
  const [formState, setFormState] = useState<ReportFormState>(defaultFormState);
  const [showDietModal, setShowDietModal] = useState<boolean>(false);
  const [vegetarianOnly, setVegetarianOnly] = useState<boolean>(false);

  const loadSampleData = () => {
    setFormState((prev) => ({
      ...prev,
      currentStructuredData: JSON.stringify(sampleCurrentData, null, 2),
      previousStructuredData: JSON.stringify(samplePreviousData, null, 2),
      currentText: "Sample text: LDL elevated, Vitamin D low, ALT mildly elevated.",
      previousText: "Sample text (2025): Higher cholesterol and lower vitamin D."
    }));
  };

  const handleAnalyzeClick = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setShowDietModal(true);
  };

  const submitAnalysis = async (vegetarianPreference: boolean) => {
    setShowDietModal(false);
    setIsLoading(true);
    setError("");

    try {
      const data = await analyzeReport(formState, vegetarianPreference);
      setResult(data);
      setActiveTab("Analysis");
    } catch (submitError) {
      const message = submitError instanceof Error ? submitError.message : "Unexpected error";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmDietPreference = () => {
    submitAnalysis(vegetarianOnly);
  };

  const handleCancelDietPreference = () => {
    setShowDietModal(false);
  };

  const handleGetStarted = () => setActiveTab("Upload");

  return (
    <div className="page">
      <header className="hero hero-landing">
        <div>
          <span className="eyebrow">Health intelligence made simple</span>
          <h1>LifeMetrics AI</h1>
          <p>
            Analyze clinical reports, compare trends, and receive tailored meal plans with a clean,
            guided workflow.
          </p>
          {/* <button className="hero-cta" type="button" onClick={handleGetStarted}>
            Get Started
          </button> */}
        </div>
      </header>

      <section className="workflow-card card">
        <ResultsTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          mode={mode}
          onModeChange={setMode}
          isReportReady={!!result}
        />
      </section>

      {isLoading ? (
        <div className="loader-overlay">
          <div className="loader-card">
            <div className="spinner" />
            <p>Analyzing report, please wait...</p>
          </div>
        </div>
      ) : null}

      {activeTab === "Upload" ? (
        <UploadForm
          formState={formState}
          onChange={(updates) => setFormState((prev) => ({ ...prev, ...updates }))}
          onAnalyzeClick={handleAnalyzeClick}
          onLoadSampleData={loadSampleData}
          isLoading={isLoading}
        />
      ) : (
        <section className="card results-card">
          {error ? <p className="error">{error}</p> : null}

          {activeTab === "Analysis" ? (
            <CurrentReportPanel result={result} mode={mode} />
          ) : null}
          {activeTab === "Comparison" ? (
            <ComparisonPanel comparison={result?.comparison ?? []} />
          ) : null}
          {activeTab === "Diet Plan" ? (
            <DietPlanPanel dietPlan={result?.dietPlan ?? { goals: [], vegetarianOptions: [], generalTips: [] }} vegetarianOnly={vegetarianOnly} />
          ) : null}

          {!result ? (
            <div className="empty-state">
              <strong>No analysis available yet.</strong>
              <p>Upload your report in the Upload tab to see findings, trends, and diet suggestions.</p>
            </div>
          ) : null}
        </section>
      )}

      {showDietModal ? (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Diet Preference</h2>
            <p>Select whether to suggest only vegetarian diet options.</p>
            <label className="toggle-field">
              <input
                type="checkbox"
                checked={vegetarianOnly}
                onChange={(event) => setVegetarianOnly(event.target.checked)}
              />
              Suggest only vegetarian diet
            </label>
            <div className="modal-actions">
              <button className="secondary" type="button" onClick={handleCancelDietPreference}>
                Cancel
              </button>
              <button className="primary" type="button" onClick={handleConfirmDietPreference}>
                Analyze with {vegetarianOnly ? "Vegetarian" : "Balanced"} Diet
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
