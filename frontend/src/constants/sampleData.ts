export const sampleCurrentData = {
  patient: "Sample User",
  reportDate: "2026-04-01",
  metrics: {
    totalCholesterol: 210,
    ldl: 132,
    hdl: 45,
    triglycerides: 160,
    vitaminD: 19.2,
    alt: 41
  }
};

export const samplePreviousData = {
  patient: "Sample User",
  reportDate: "2025-04-01",
  metrics: {
    totalCholesterol: 230,
    ldl: 149,
    hdl: 42,
    triglycerides: 180,
    vitaminD: 16,
    alt: 32
  }
};

export const tabs = ["Upload", "Analysis", "Comparison", "Diet Plan"] as const;
