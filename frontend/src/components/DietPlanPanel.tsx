import type { DietPlan } from "../types/health";

interface DietPlanPanelProps {
  dietPlan: DietPlan;
  vegetarianOnly?: boolean;
}

const mealSlots = ["Breakfast", "Lunch", "Snack", "Dinner"] as const;

export default function DietPlanPanel({ dietPlan, vegetarianOnly = false }: DietPlanPanelProps) {
  const options = Array.isArray(dietPlan?.vegetarianOptions) ? dietPlan.vegetarianOptions : [];
  const goals = Array.isArray(dietPlan?.goals) ? dietPlan.goals : [];
  const generalTips = Array.isArray(dietPlan?.generalTips) ? dietPlan.generalTips : [];

  // Flexibly parse meals instead of rigidly matching slots
  const parsedMeals = options.map((option, idx) => {
    if (typeof option !== 'string') return { title: `Meal ${idx + 1}`, content: JSON.stringify(option) };
    const parts = option.split(':');
    if (parts.length > 1) {
      return { title: parts[0].trim(), content: parts.slice(1).join(':').trim() };
    }
    return { title: `Meal Suggestion ${idx + 1}`, content: option };
  });

  if (parsedMeals.length === 0) {
    parsedMeals.push({
      title: "General Diet",
      content: vegetarianOnly
        ? "A balanced diet with vegetables, whole grains, and plant protein."
        : "A balanced diet with lean protein, whole grains, and vegetables."
    });
  }

  return (
    <div className="panel diet-panel">
      <div className="panel-header">
        <div>
          <h3>Diet Plan</h3>
          <p className="panel-copy">Structured meal suggestions and practical tips for your report.</p>
        </div>
      </div>

      <div className="goals-block">
        <h4>Goals</h4>
        <div className="goals-list">
          {goals.map((goal, idx) => (
            <span key={`${goal}-${idx}`} className="goal-chip">
              {goal}
            </span>
          ))}
        </div>
      </div>

      <div className="meals-grid">
        {parsedMeals.map((item, idx) => (
          <div key={idx} className="meal-card">
            <h4 style={{ textTransform: "capitalize" }}>{item.title}</h4>
            <p>{item.content}</p>
          </div>
        ))}
      </div>

      <div className="tips-block">
        <h4>General Tips</h4>
        <ul>
          {generalTips.map((tip, idx) => (
            <li key={`${tip}-${idx}`}>{tip}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
