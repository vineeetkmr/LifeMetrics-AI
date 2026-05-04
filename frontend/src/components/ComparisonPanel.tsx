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
    <div className="panel comparison-panel">
      <div className="panel-header">
        <div>
          <h3>Year-over-Year Comparison</h3>
          <p className="panel-copy">Track what improved and what needs attention in your latest results.</p>
        </div>
      </div>

      {chartData.length === 0 ? (
        <p>No previous report comparison available.</p>
      ) : (
        <>
          <div className="chart-grid">
            <div className="chart-card">
              <h4>Recent Values</h4>
              <ResponsiveContainer width="100%" height={240}>
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
            <div className="chart-card">
              <h4>Change Trend</h4>
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
          </div>

          <div className="highlights">
            {comparison.map((item, idx) => {
              const changePositive = item.changePercent < 0 ? true : item.direction === "improved";
              return (
                <div
                  key={`${item.metric}-${idx}`}
                  className={`highlight ${changePositive ? "positive" : "negative"}`}
                >
                  <div className="highlight-title">
                    <strong>{item.metric}</strong>
                    <span className="highlight-arrow">{changePositive ? "▲" : "▼"}</span>
                  </div>
                  <p className="highlight-value">
                    {item.previous} → {item.current} {item.unit ?? ""}
                  </p>
                  <p className="highlight-change">
                    {item.changePercent > 0 ? "+" : ""}
                    {item.changePercent}% {item.direction}
                  </p>
                  <p>{item.note}</p>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
