export type ActiveTab = "Upload" | "Analysis" | "Comparison" | "Diet Plan";

export type ViewMode = "detailed" | "eli5";

export interface ComparisonItem {
  metric: string;
  previous: number;
  current: number;
  changePercent: number;
  direction: string;
  unit?: string;
  note: string;
}

export interface DietPlan {
  goals: string[];
  vegetarianOptions: string[];
  generalTips: string[];
}

export interface AnalysisResult {
  summary: string[];
  detailedExplanation: string;
  simplifiedSummary: string;
  comparison: ComparisonItem[];
  dietPlan: DietPlan;
  demographics?: {
    age?: string | null;
    height?: string | null;
    weight?: string | null;
    bmi?: string | null;
  };
}

export interface ReportFormState {
  currentFile: File | null;
  previousFiles: File[];
  currentText: string;
  previousText: string;
  currentStructuredData: string;
  previousStructuredData: string;
  age: string;
  weight: string;
  height: string;
}
