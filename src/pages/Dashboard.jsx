import { Link } from "react-router-dom";
import {
  Briefcase, TrendingUp, Star, CheckCircle2,
  MessageSquare, XCircle, PlusCircle,
} from "lucide-react";
import { useApplications } from "../hooks/useApplications";
import JobCard from "../components/JobCard";

/* ─── Stat card ─────────────────────────────────────────────────────────── */
function StatCard({ label, value, icon: Icon, color }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-5 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div>
        <p className="text-2xl font-bold text-slate-800">{value}</p>
        <p className="text-xs text-slate-500 mt-0.5">{label}</p>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { applications, stats } = useApplications();

  // Recent 3 bookmarked or just recent 3
  const recent = applications.slice(0, 3);
  const bookmarked = applications.filter((a) => a.bookmarked).slice(0, 3);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">

      {/* ── Header ─────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Welcome back — here's your job search at a glance.
          </p>
        </div>
        <Link
          to="/applications/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white
            bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-700 hover:to-brand-600
            shadow-md hover:shadow-brand-300/40 transition-all"
        >
          <PlusCircle className="w-4 h-4" /> Add Application
        </Link>
      </div>

      {/* ── Stats grid ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard label="Total"     value={stats.total}     icon={Briefcase}      color="bg-gradient-to-br from-brand-500 to-brand-700" />
        <StatCard label="Applied"   value={stats.applied}   icon={TrendingUp}     color="bg-gradient-to-br from-blue-400 to-blue-600"   />
        <StatCard label="Interview" value={stats.interview} icon={MessageSquare}  color="bg-gradient-to-br from-amber-400 to-amber-600" />
        <StatCard label="Offer"     value={stats.offer}     icon={CheckCircle2}   color="bg-gradient-to-br from-emerald-400 to-emerald-600" />
        <StatCard label="Rejected"  value={stats.rejected}  icon={XCircle}        color="bg-gradient-to-br from-red-400 to-red-600"     />
        <StatCard label="Saved"     value={stats.bookmarked} icon={Star}          color="bg-gradient-to-br from-violet-400 to-violet-600" />
      </div>

      {/* ── Two-column row ──────────────────────────────────────────── */}
      <div className="grid lg:grid-cols-2 gap-8">

        {/* Recent applications */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-slate-700">Recent Applications</h2>
            <Link to="/applications" className="text-xs text-brand-600 hover:underline">
              View all →
            </Link>
          </div>
          {recent.length === 0 ? (
            <p className="text-sm text-slate-400">No applications yet.</p>
          ) : (
            <div className="space-y-4">
              {recent.map((app) => <JobCard key={app.id} app={app} />)}
            </div>
          )}
        </section>

        {/* Bookmarked */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-slate-700">Saved / Bookmarked</h2>
            <span className="text-xs text-slate-400">{stats.bookmarked} saved</span>
          </div>
          {bookmarked.length === 0 ? (
            <p className="text-sm text-slate-400">
              No bookmarks yet — click the bookmark icon on any card.
            </p>
          ) : (
            <div className="space-y-4">
              {bookmarked.map((app) => <JobCard key={app.id} app={app} />)}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
