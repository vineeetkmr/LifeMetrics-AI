import { tabs } from "../constants/sampleData";
import type { ActiveTab, ViewMode } from "../types/health";
import "./ResultsTabs.css";

interface ResultsTabsProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  mode: ViewMode;
  onModeChange: (mode: ViewMode) => void;
  isReportReady: boolean;
}

export default function ResultsTabs({
  activeTab,
  onTabChange,
  mode,
  onModeChange,
  isReportReady
}: ResultsTabsProps) {
  return (
    <div className="top-row">
      <div className="tabs">
        {tabs.map((tab) => {
          const disabled = tab !== "Upload" && !isReportReady;
          return (
            <button
              key={tab}
              className={tab === activeTab ? "tab active" : "tab"}
              onClick={() => !disabled && onTabChange(tab)}
              type="button"
              disabled={disabled}
            >
              {tab}
            </button>
          );
        })}
      </div>
      <div className="mode-toggle">
        <span>View:</span>
        <button
          type="button"
          className={mode === "detailed" ? "toggle active" : "toggle"}
          onClick={() => onModeChange("detailed")}
        >
          Detailed
        </button>
        <button
          type="button"
          className={mode === "eli5" ? "toggle active" : "toggle"}
          onClick={() => onModeChange("eli5")}
        >
          Simplified (ELI5)
        </button>
      </div>
    </div>
  );
}
