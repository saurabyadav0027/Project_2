import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import {
  Building2, Briefcase, CalendarDays,
  MapPin, DollarSign, StickyNote,
  CheckCircle2, AlertCircle, ArrowLeft,
} from "lucide-react";
import { useApplications } from "../hooks/useApplications";

/* ─── Validation schema ─────────────────────────────────────────────────── */
const schema = yup.object({
  company: yup
    .string().trim()
    .min(2, "Company name must be at least 2 characters.")
    .required("Company name is required."),
  role: yup
    .string().trim()
    .min(2, "Role must be at least 2 characters.")
    .required("Role / position is required."),
  appliedDate: yup
    .string()
    .required("Applied date is required.")
    .test("not-future", "Applied date cannot be in the future.", (val) => {
      if (!val) return false;
      return new Date(val) <= new Date();
    }),
  status:   yup.string().oneOf(["Applied", "Interview", "Offer", "Rejected"]).required(),
  location: yup.string().trim(),
  salary:   yup.string().trim(),
  notes:    yup.string().trim().max(500, "Notes must be under 500 characters."),
});

/* ─── Helpers ───────────────────────────────────────────────────────────── */
function inputCls(hasError) {
  return [
    "w-full rounded-xl border px-4 py-2.5 text-sm text-slate-800",
    "placeholder-slate-400 bg-white transition-all duration-150",
    "focus:outline-none focus:ring-2",
    hasError
      ? "border-red-300 focus:ring-red-200"
      : "border-slate-200 focus:ring-brand-300 focus:border-brand-400",
  ].join(" ");
}

function Field({ label, icon: Icon, error, children }) {
  return (
    <div>
      <label className="flex items-center gap-1.5 text-sm font-medium text-slate-700 mb-1.5">
        <Icon className="w-4 h-4 text-slate-400" />
        {label}
      </label>
      {children}
      {error && (
        <p className="mt-1.5 flex items-center gap-1 text-xs text-red-600">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}

/* ─── Page ──────────────────────────────────────────────────────────────── */
export default function AddApplication() {
  const { addApplication } = useApplications();
  const navigate           = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitSuccessful, isSubmitting },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      company:     "",
      role:        "",
      appliedDate: new Date().toISOString().slice(0, 10),
      status:      "Applied",
      location:    "",
      salary:      "",
      notes:       "",
    },
  });

  const onSubmit = (data) => {
    addApplication(data);
    reset();
    setTimeout(() => navigate("/applications"), 1200);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-2xl mx-auto">

        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-brand-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-card border border-slate-100 overflow-hidden">

          {/* Header strip */}
          <div className="bg-gradient-to-r from-brand-600 to-brand-500 px-8 py-6">
            <h1 className="text-xl font-bold text-white">Add New Application</h1>
            <p className="text-brand-100 text-sm mt-0.5">
              Track a new job opportunity in your pipeline.
            </p>
          </div>

          {/* Form body */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="px-8 py-7 space-y-5"
          >
            {/* Success banner */}
            {isSubmitSuccessful && (
              <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl px-4 py-3 text-sm animate-fade-in">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                Application saved! Redirecting to your list…
              </div>
            )}

            {/* Row 1: Company | Role */}
            <div className="grid sm:grid-cols-2 gap-5">
              <Field label="Company Name *" icon={Building2} error={errors.company?.message}>
                <input
                  {...register("company")}
                  type="text"
                  placeholder="e.g. Google"
                  className={inputCls(!!errors.company)}
                />
              </Field>
              <Field label="Role / Position *" icon={Briefcase} error={errors.role?.message}>
                <input
                  {...register("role")}
                  type="text"
                  placeholder="e.g. Frontend Engineer"
                  className={inputCls(!!errors.role)}
                />
              </Field>
            </div>

            {/* Row 2: Applied Date | Status */}
            <div className="grid sm:grid-cols-2 gap-5">
              <Field label="Applied Date *" icon={CalendarDays} error={errors.appliedDate?.message}>
                <input
                  {...register("appliedDate")}
                  type="date"
                  className={inputCls(!!errors.appliedDate)}
                />
              </Field>
              <Field label="Status" icon={CheckCircle2} error={errors.status?.message}>
                <select {...register("status")} className={inputCls(!!errors.status)}>
                  {["Applied", "Interview", "Offer", "Rejected"].map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </Field>
            </div>

            {/* Row 3: Location | Salary */}
            <div className="grid sm:grid-cols-2 gap-5">
              <Field label="Location (optional)" icon={MapPin} error={errors.location?.message}>
                <input
                  {...register("location")}
                  type="text"
                  placeholder="e.g. Remote / New York, NY"
                  className={inputCls(!!errors.location)}
                />
              </Field>
              <Field label="Salary / Range (optional)" icon={DollarSign} error={errors.salary?.message}>
                <input
                  {...register("salary")}
                  type="text"
                  placeholder="e.g. $120,000 – $140,000"
                  className={inputCls(!!errors.salary)}
                />
              </Field>
            </div>

            {/* Notes */}
            <Field label="Notes (optional)" icon={StickyNote} error={errors.notes?.message}>
              <textarea
                {...register("notes")}
                rows={3}
                placeholder="Recruiter contact, referral info, interview notes…"
                className={inputCls(!!errors.notes) + " resize-none"}
              />
            </Field>

            {/* Actions */}
            <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => navigate("/applications")}
                className="px-5 py-2.5 rounded-xl text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || isSubmitSuccessful}
                className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white
                  bg-gradient-to-r from-brand-600 to-brand-500
                  hover:from-brand-700 hover:to-brand-600
                  shadow-md hover:shadow-brand-300/40
                  disabled:opacity-60 disabled:cursor-not-allowed
                  transition-all duration-150"
              >
                {isSubmitting ? "Saving…" : isSubmitSuccessful ? "Saved ✓" : "Save Application"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
