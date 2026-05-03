import type { DietPlan } from "../types/health";

interface DietPlanPanelProps {
  dietPlan: DietPlan;
}

export default function DietPlanPanel({ dietPlan }: DietPlanPanelProps) {
  const mealSlots = ["Breakfast", "Lunch", "Snack", "Dinner"] as const;
  const getVegetarianMeal = (slot: (typeof mealSlots)[number]) => {
    const match = dietPlan.vegetarianOptions.find((item) => item.startsWith(`${slot}:`));
    return match ? match.replace(`${slot}:`, "").trim() : "Balanced whole-food option.";
  };

  const vegetarianMealPlan = mealSlots.map((slot) => ({
    slot,
    plan: getVegetarianMeal(slot)
  }));

  const mixedMealPlan = [
    { slot: "Breakfast", plan: "2 eggs with whole-grain toast and fruit." },
    { slot: "Lunch", plan: "Grilled chicken salad with olive oil and mixed greens." },
    { slot: "Snack", plan: "Greek yogurt with nuts or roasted chana." },
    { slot: "Dinner", plan: "Baked fish with quinoa and steamed vegetables." }
  ] as const;

  const activeMealPlan = mixedMealPlan;

  return (
    <div className="panel">
      <h3>Suggested Diet Plan</h3>
      <h4>Goals</h4>
      <ul>
        {dietPlan.goals.map((goal, idx) => (
          <li key={`${goal}-${idx}`}>{goal}</li>
        ))}
      </ul>
      <h4>Weekly Meal Plan</h4>
      <ul>
        {activeMealPlan.map((item) => (
          <li key={item.slot}>
            <strong>{item.slot}:</strong> {item.plan}
          </li>
        ))}
      </ul>
      <h4>General Tips</h4>
      <ul>
        {dietPlan.generalTips.map((item, idx) => (
          <li key={`${item}-${idx}`}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
