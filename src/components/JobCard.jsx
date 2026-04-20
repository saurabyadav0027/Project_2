import { useState } from "react";
import {
  Bookmark, BookmarkCheck, Trash2, Pencil,
  MapPin, CalendarDays, DollarSign, X, Save,
} from "lucide-react";
import { useApplications } from "../hooks/useApplications";

/* ─── Status colour map ─────────────────────────────────────────────────── */
const STATUS_STYLES = {
  Applied:   "bg-blue-50    text-blue-700    ring-blue-200",
  Interview: "bg-amber-50   text-amber-700   ring-amber-200",
  Offer:     "bg-emerald-50 text-emerald-700 ring-emerald-200",
  Rejected:  "bg-red-50     text-red-700     ring-red-200",
};
const STATUS_DOT = {
  Applied:   "bg-blue-500",
  Interview: "bg-amber-500",
  Offer:     "bg-emerald-500",
  Rejected:  "bg-red-500",
};
const ALL_STATUSES = ["Applied", "Interview", "Offer", "Rejected"];

/* ─── Deterministic gradient from company name ──────────────────────────── */
const GRADIENTS = [
  "from-violet-500 to-indigo-600",
  "from-sky-500    to-cyan-600",
  "from-emerald-500 to-teal-600",
  "from-orange-500 to-amber-600",
  "from-pink-500   to-rose-600",
];
function companyGradient(name = "") {
  const idx =
    name.split("").reduce((a, c) => a + c.charCodeAt(0), 0) % GRADIENTS.length;
  return GRADIENTS[idx];
}

/* ─── Inline Edit Form ──────────────────────────────────────────────────── */
function EditForm({ app, onSave, onCancel }) {
  const [form, setForm] = useState({
    company:     app.company,
    role:        app.role,
    status:      app.status,
    location:    app.location    || "",
    salary:      app.salary      || "",
    appliedDate: app.appliedDate || "",
    notes:       app.notes       || "",
  });

  const handle = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const inputCls =
    "w-full text-sm border border-slate-200 rounded-lg px-3 py-2 " +
    "focus:outline-none focus:ring-2 focus:ring-brand-400 text-slate-800 bg-white transition";

  return (
    <div className="space-y-3 pt-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {[
          { name: "company",  label: "Company"  },
          { name: "role",     label: "Role"     },
          { name: "location", label: "Location" },
          { name: "salary",   label: "Salary"   },
        ].map(({ name, label }) => (
          <div key={name}>
            <label className="block text-xs font-medium text-slate-500 mb-1">{label}</label>
            <input
              type="text"
              name={name}
              value={form[name]}
              onChange={handle}
              className={inputCls}
            />
          </div>
        ))}

        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">Applied Date</label>
          <input
            type="date"
            name="appliedDate"
            value={form.appliedDate}
            onChange={handle}
            className={inputCls}
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">Status</label>
          <select name="status" value={form.status} onChange={handle} className={inputCls}>
            {ALL_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-500 mb-1">Notes</label>
        <textarea
          name="notes"
          value={form.notes}
          onChange={handle}
          rows={2}
          className={inputCls + " resize-none"}
        />
      </div>

      <div className="flex justify-end gap-2 pt-1">
        <button
          onClick={onCancel}
          className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg text-slate-600 bg-slate-100 hover:bg-slate-200 transition"
        >
          <X className="w-3.5 h-3.5" /> Cancel
        </button>
        <button
          onClick={() => onSave(form)}
          className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg text-white bg-brand-600 hover:bg-brand-700 shadow-sm transition"
        >
          <Save className="w-3.5 h-3.5" /> Save
        </button>
      </div>
    </div>
  );
}

/* ─── JobCard ───────────────────────────────────────────────────────────── */
export default function JobCard({ app }) {
  const { deleteApplication, toggleBookmark, editApplication } = useApplications();
  const [editing, setEditing]               = useState(false);
  const [confirmDelete, setConfirmDelete]   = useState(false);

  const handleSave = (updates) => {
    editApplication(app.id, updates);
    setEditing(false);
  };

  const initials = (app.company || "JB").slice(0, 2).toUpperCase();
  const gradient = companyGradient(app.company);

  return (
    <article
      className={`group relative bg-white rounded-2xl border border-slate-200 shadow-card p-5
        transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg
        ${editing ? "ring-2 ring-brand-400" : ""}`}
    >
      {/* ── Top row ──────────────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-3">
        {/* Avatar + title */}
        <div className="flex items-center gap-3 min-w-0">
          <div
            className={`flex-shrink-0 w-11 h-11 rounded-xl bg-gradient-to-br ${gradient}
              flex items-center justify-center text-white text-sm font-bold shadow-md`}
          >
            {initials}
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-slate-800 truncate leading-snug">{app.company}</h3>
            <p className="text-sm text-slate-500 truncate">{app.role}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            onClick={() => toggleBookmark(app.id)}
            title={app.bookmarked ? "Remove bookmark" : "Bookmark"}
            className={`p-2 rounded-lg transition-colors
              ${app.bookmarked
                ? "text-brand-600 bg-brand-50 hover:bg-brand-100"
                : "text-slate-400 hover:text-brand-500 hover:bg-brand-50"}`}
          >
            {app.bookmarked
              ? <BookmarkCheck className="w-4 h-4" />
              : <Bookmark      className="w-4 h-4" />}
          </button>

          <button
            onClick={() => { setEditing((e) => !e); setConfirmDelete(false); }}
            title="Edit"
            className="p-2 rounded-lg text-slate-400 hover:text-brand-600 hover:bg-brand-50 transition-colors"
          >
            <Pencil className="w-4 h-4" />
          </button>

          <button
            onClick={() => { setConfirmDelete((s) => !s); setEditing(false); }}
            title="Delete"
            className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── Delete confirm ───────────────────────────────────────── */}
      {confirmDelete && (
        <div className="mt-3 flex items-center justify-between gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5 animate-fade-in">
          <p className="text-sm text-red-700 font-medium">Remove this application?</p>
          <div className="flex gap-2">
            <button
              onClick={() => setConfirmDelete(false)}
              className="text-xs px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              onClick={() => deleteApplication(app.id)}
              className="text-xs px-3 py-1.5 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
            >
              Delete
            </button>
          </div>
        </div>
      )}

      {/* ── Inline edit ──────────────────────────────────────────── */}
      {editing && (
        <div className="mt-3 border-t border-slate-100 animate-fade-in">
          <EditForm app={app} onSave={handleSave} onCancel={() => setEditing(false)} />
        </div>
      )}

      {/* ── Meta chips ───────────────────────────────────────────── */}
      {!editing && (
        <>
          <div className="mt-3 flex flex-wrap gap-2">
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ring-1 ${STATUS_STYLES[app.status]}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[app.status]}`} />
              {app.status}
            </span>

            {app.location && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs text-slate-500 bg-slate-100 ring-1 ring-slate-200">
                <MapPin className="w-3 h-3" />{app.location}
              </span>
            )}

            {app.salary && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs text-slate-500 bg-slate-100 ring-1 ring-slate-200">
                <DollarSign className="w-3 h-3" />{app.salary}
              </span>
            )}
          </div>

          <div className="mt-3 flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 text-xs text-slate-400">
              <CalendarDays className="w-3.5 h-3.5" />
              {app.appliedDate
                ? new Date(app.appliedDate).toLocaleDateString("en-US", {
                    month: "short", day: "numeric", year: "numeric",
                  })
                : "—"}
            </span>
            {app.bookmarked && (
              <span className="text-xs text-brand-600 font-medium bg-brand-50 px-2 py-0.5 rounded-full">
                Saved
              </span>
            )}
          </div>

          {app.notes && (
            <p className="mt-2.5 text-xs text-slate-500 bg-slate-50 rounded-lg px-3 py-2 line-clamp-2 border border-slate-100">
              {app.notes}
            </p>
          )}
        </>
      )}
    </article>
  );
}
