import { tabs } from "../constants/sampleData";
import type { ActiveTab, ViewMode } from "../types/health";
import "./ResultsTabs.css";

interface ResultsTabsProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  mode: ViewMode;
  onModeChange: (mode: ViewMode) => void;
}

export default function ResultsTabs({
  activeTab,
  onTabChange,
  mode,
  onModeChange
}: ResultsTabsProps) {
  return (
    <div className="top-row">
      <div className="tabs">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={tab === activeTab ? "tab active" : "tab"}
            onClick={() => onTabChange(tab)}
            type="button"
          >
            {tab}
          </button>
        ))}
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
