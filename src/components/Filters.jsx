import { Filter } from "lucide-react";

const STATUSES = ["All", "Applied", "Interview", "Offer", "Rejected"];

export default function Filters({ activeStatus, onStatusChange }) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <Filter className="w-4 h-4 text-slate-400 flex-shrink-0" />
      {STATUSES.map((s) => (
        <button
          key={s}
          onClick={() => onStatusChange(s)}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all duration-150
            ${activeStatus === s
              ? "bg-brand-600 text-white border-brand-600 shadow-sm"
              : "bg-white text-slate-600 border-slate-200 hover:border-brand-300 hover:text-brand-600"
            }`}
        >
          {s}
        </button>
      ))}
    </div>
  );
}
