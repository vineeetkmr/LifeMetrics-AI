import type { DietPlan } from "../types/health";

interface DietPlanPanelProps {
  dietPlan: DietPlan;
  vegetarianOnly?: boolean;
}

const mealSlots = ["Breakfast", "Lunch", "Snack", "Dinner"] as const;

export default function DietPlanPanel({ dietPlan, vegetarianOnly = false }: DietPlanPanelProps) {
  const findMeal = (slot: (typeof mealSlots)[number]) => {
    const match = dietPlan.vegetarianOptions.find((item) =>
      item.toLowerCase().startsWith(slot.toLowerCase())
    );
    return match ? match.split(":").slice(1).join(":").trim() : undefined;
  };

  const mealPlan = mealSlots.map((slot) => ({
    slot,
    plan:
      findMeal(slot) ||
      (vegetarianOnly
        ? `A balanced ${slot.toLowerCase()} with vegetables, whole grains, and plant protein.`
        : `A balanced ${slot.toLowerCase()} with lean protein, whole grains, and vegetables.`)
  }));

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
          {dietPlan.goals.map((goal, idx) => (
            <span key={`${goal}-${idx}`} className="goal-chip">
              {goal}
            </span>
          ))}
        </div>
      </div>

      <div className="meals-grid">
        {mealPlan.map((item) => (
          <div key={item.slot} className="meal-card">
            <h4>{item.slot}</h4>
            <p>{item.plan}</p>
          </div>
        ))}
      </div>

      <div className="tips-block">
        <h4>General Tips</h4>
        <ul>
          {dietPlan.generalTips.map((tip, idx) => (
            <li key={`${tip}-${idx}`}>{tip}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
