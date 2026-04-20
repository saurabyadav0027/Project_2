import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend,
} from "recharts";

const STATUS_COLORS = {
  Applied:   "#6366f1",
  Interview: "#f59e0b",
  Offer:     "#10b981",
  Rejected:  "#ef4444",
};

/* ─── Donut / Pie chart ─────────────────────────────────────────────────── */
export function StatusPieChart({ stats }) {
  const data = Object.entries({
    Applied:   stats.applied,
    Interview: stats.interview,
    Offer:     stats.offer,
    Rejected:  stats.rejected,
  })
    .filter(([, v]) => v > 0)
    .map(([name, value]) => ({ name, value }));

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-52 text-sm text-slate-400">
        No data yet.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={55}
          outerRadius={85}
          paddingAngle={3}
          dataKey="value"
        >
          {data.map((entry) => (
            <Cell key={entry.name} fill={STATUS_COLORS[entry.name]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{ borderRadius: "0.75rem", border: "1px solid #e2e8f0", fontSize: "0.8rem" }}
          itemStyle={{ color: "#475569" }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

/* ─── Monthly bar chart ─────────────────────────────────────────────────── */
export function MonthlyBarChart({ applications }) {
  // Group by month
  const monthly = {};
  applications.forEach((app) => {
    const d = new Date(app.appliedDate || app.createdAt);
    const key = d.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
    monthly[key] = (monthly[key] || 0) + 1;
  });

  const data = Object.entries(monthly)
    .slice(-6)                              // last 6 months
    .map(([month, count]) => ({ month, count }));

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-52 text-sm text-slate-400">
        No data yet.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} barSize={28}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
        <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
        <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
        <Tooltip
          contentStyle={{ borderRadius: "0.75rem", border: "1px solid #e2e8f0", fontSize: "0.8rem" }}
          cursor={{ fill: "#f8fafc" }}
        />
        <Bar dataKey="count" fill="#6366f1" radius={[6, 6, 0, 0]} name="Applications" />
      </BarChart>
    </ResponsiveContainer>
  );
}
