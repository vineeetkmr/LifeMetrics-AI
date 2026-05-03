import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend
} from "recharts";
import type { AnalysisResult } from "../types/health";
import "./ComparisonPanel.css";

interface ComparisonPanelProps {
  comparison: AnalysisResult["comparison"];
}

export default function ComparisonPanel({ comparison }: ComparisonPanelProps) {
  const chartData = comparison.map((item) => ({
    metric: item.metric,
    previous: Number(item.previous ?? 0),
    current: Number(item.current ?? 0),
    changePercent: Number(item.changePercent ?? 0)
  }));

  return (
    <div className="panel">
      <h3>Year-over-Year Comparison Dashboard</h3>
      {chartData.length === 0 ? (
        <p>No previous report comparison available.</p>
      ) : (
        <>
          <div className="chart">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="metric" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="previous" fill="#94a3b8" name="Previous" />
                <Bar dataKey="current" fill="#2563eb" name="Current" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="chart">
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="metric" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="changePercent" stroke="#16a34a" name="Change %" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="highlights">
            {comparison.map((item, idx) => (
              <div key={`${item.metric}-${idx}`} className="highlight">
                <strong>{item.metric}</strong>
                <p>
                  {item.previous} to {item.current} {item.unit ?? ""}
                </p>
                <p>
                  {item.changePercent > 0 ? "+" : ""}
                  {item.changePercent}% ({item.direction})
                </p>
                <p>{item.note}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
