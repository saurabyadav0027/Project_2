import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { PlusCircle, FolderOpen } from "lucide-react";
import { useApplications } from "../hooks/useApplications";
import { useDebounce }      from "../hooks/useDebounce";
import JobCard    from "../components/JobCard";
import SearchBar  from "../components/SearchBar";
import Filters    from "../components/Filters";

export default function Applications() {
  const { applications, stats } = useApplications();
  const [query, setQuery]       = useState("");
  const [status, setStatus]     = useState("All");
  const debouncedQuery          = useDebounce(query, 250);

  const filtered = useMemo(() => {
    return applications.filter((app) => {
      const matchesStatus =
        status === "All" || app.status === status;
      const q = debouncedQuery.toLowerCase();
      const matchesQuery =
        !q ||
        app.company.toLowerCase().includes(q) ||
        app.role.toLowerCase().includes(q)    ||
        (app.location || "").toLowerCase().includes(q);
      return matchesStatus && matchesQuery;
    });
  }, [applications, status, debouncedQuery]);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">

      {/* ── Header ─────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Applications</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {stats.total} total · {filtered.length} showing
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

      {/* ── Search + Filters ───────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row gap-3">
        <SearchBar value={query} onChange={setQuery} placeholder="Search by company, role, or location…" />
        <Filters activeStatus={status} onStatusChange={setStatus} />
      </div>

      {/* ── Cards grid ─────────────────────────────────────────────── */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <FolderOpen className="w-12 h-12 text-slate-300 mb-3" />
          <p className="text-slate-500 font-medium">No applications found.</p>
          <p className="text-sm text-slate-400 mt-1">Try a different search or filter.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((app) => (
            <JobCard key={app.id} app={app} />
          ))}
        </div>
      )}
    </main>
  );
}
