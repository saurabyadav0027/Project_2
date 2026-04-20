import { useMemo } from "react";
import { useApplications } from "../hooks/useApplications";
import { StatusPieChart, MonthlyBarChart } from "../components/Charts";
import { TrendingUp, Award, Target, Clock } from "lucide-react";

/* ─── KPI card ──────────────────────────────────────────────────────────── */
function KPICard({ label, value, sub, icon: Icon, color }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-5">
      <div className="flex items-start justify-between">
        <p className="text-sm text-slate-500">{label}</p>
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${color}`}>
          <Icon className="w-4.5 h-4.5 text-white" />
        </div>
      </div>
      <p className="mt-3 text-3xl font-bold text-slate-800">{value}</p>
      {sub && <p className="mt-0.5 text-xs text-slate-400">{sub}</p>}
    </div>
  );
}

export default function Analytics() {
  const { applications, stats } = useApplications();

  /* Conversion rate: offers / total */
  const conversionRate = stats.total > 0
    ? Math.round((stats.offer / stats.total) * 100)
    : 0;

  /* Interview rate */
  const interviewRate = stats.total > 0
    ? Math.round(((stats.interview + stats.offer) / stats.total) * 100)
    : 0;

  /* Avg days from applied to now (simple proxy) */
  const avgDays = useMemo(() => {
    if (applications.length === 0) return 0;
    const now = Date.now();
    const total = applications.reduce((sum, a) => {
      const d = new Date(a.appliedDate || a.createdAt).getTime();
      return sum + (now - d) / 86400000;
    }, 0);
    return Math.round(total / applications.length);
  }, [applications]);

  /* Top company by attempts */
  const topCompany = useMemo(() => {
    const counts = {};
    applications.forEach((a) => {
      counts[a.company] = (counts[a.company] || 0) + 1;
    });
    const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
    return top ? top[0] : "—";
  }, [applications]);

  /* Legend for pie */
  const LEGEND = [
    { label: "Applied",   color: "bg-brand-500",    value: stats.applied   },
    { label: "Interview", color: "bg-amber-400",     value: stats.interview },
    { label: "Offer",    color: "bg-emerald-500",   value: stats.offer     },
    { label: "Rejected", color: "bg-red-400",       value: stats.rejected  },
  ];

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">

      {/* ── Header ─────────────────────────────────────────────────── */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Analytics</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Deep-dive into your job search performance.
        </p>
      </div>

      {/* ── KPI cards ──────────────────────────────────────────────── */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <KPICard
          label="Offer Rate"
          value={`${conversionRate}%`}
          sub={`${stats.offer} offer${stats.offer !== 1 ? "s" : ""} from ${stats.total} apps`}
          icon={Award}
          color="bg-gradient-to-br from-emerald-400 to-emerald-600"
        />
        <KPICard
          label="Interview Rate"
          value={`${interviewRate}%`}
          sub="Reached interview stage"
          icon={TrendingUp}
          color="bg-gradient-to-br from-brand-400 to-brand-600"
        />
        <KPICard
          label="Avg. Days Active"
          value={avgDays}
          sub="Days since each application"
          icon={Clock}
          color="bg-gradient-to-br from-amber-400 to-amber-600"
        />
        <KPICard
          label="Top Company"
          value={topCompany}
          sub="Most applied to"
          icon={Target}
          color="bg-gradient-to-br from-violet-400 to-violet-600"
        />
      </div>

      {/* ── Charts row ─────────────────────────────────────────────── */}
      <div className="grid lg:grid-cols-2 gap-8">

        {/* Pie chart */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-6">
          <h2 className="font-semibold text-slate-700 mb-1">Status Breakdown</h2>
          <p className="text-xs text-slate-400 mb-4">Distribution of your {stats.total} applications.</p>
          <StatusPieChart stats={stats} />
          {/* Legend */}
          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 justify-center">
            {LEGEND.map(({ label, color, value }) => (
              <div key={label} className="flex items-center gap-1.5 text-xs text-slate-600">
                <span className={`w-2.5 h-2.5 rounded-full ${color}`} />
                {label} <span className="font-semibold text-slate-800">({value})</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bar chart */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-6">
          <h2 className="font-semibold text-slate-700 mb-1">Monthly Activity</h2>
          <p className="text-xs text-slate-400 mb-4">Applications submitted per month (last 6).</p>
          <MonthlyBarChart applications={applications} />
        </div>
      </div>

      {/* ── Status table ───────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-card overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h2 className="font-semibold text-slate-700">All Applications</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide">
              <tr>
                {["Company", "Role", "Status", "Applied Date", "Location", "Salary"].map((h) => (
                  <th key={h} className="px-5 py-3 text-left font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {applications.map((app) => (
                <tr key={app.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3 font-medium text-slate-800">{app.company}</td>
                  <td className="px-5 py-3 text-slate-600">{app.role}</td>
                  <td className="px-5 py-3">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ring-1
                      ${{
                        Applied:   "bg-blue-50    text-blue-700    ring-blue-200",
                        Interview: "bg-amber-50   text-amber-700   ring-amber-200",
                        Offer:     "bg-emerald-50 text-emerald-700 ring-emerald-200",
                        Rejected:  "bg-red-50     text-red-700     ring-red-200",
                      }[app.status]}`}>
                      {app.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-slate-500">
                    {app.appliedDate
                      ? new Date(app.appliedDate).toLocaleDateString("en-US", {
                          month: "short", day: "numeric", year: "numeric",
                        })
                      : "—"}
                  </td>
                  <td className="px-5 py-3 text-slate-500">{app.location || "—"}</td>
                  <td className="px-5 py-3 text-slate-500">{app.salary   || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {applications.length === 0 && (
            <p className="text-center py-10 text-sm text-slate-400">No data yet.</p>
          )}
        </div>
      </div>
    </main>
  );
}
