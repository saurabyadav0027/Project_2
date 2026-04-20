import { createContext, useCallback } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";

// ─── Shape of a single application entry ─────────────────────────────────────
// {
//   id:          string   (crypto.randomUUID)
//   company:     string
//   role:        string
//   status:      "Applied" | "Interview" | "Offer" | "Rejected"
//   appliedDate: string   (YYYY-MM-DD)
//   location:    string
//   salary:      string
//   notes:       string
//   bookmarked:  boolean
//   createdAt:   string   (ISO timestamp)
// }

export const ApplicationContext = createContext(null);

// ─── Seed data (shown on first launch, cleared once user edits) ───────────────
const SEED = [
  {
    id: "seed-1",
    company: "Google",
    role: "Frontend Engineer",
    status: "Interview",
    appliedDate: "2025-04-01",
    location: "Mountain View, CA",
    salary: "$180,000",
    notes: "Referred by a friend on the Chrome team.",
    bookmarked: true,
    createdAt: new Date("2025-04-01").toISOString(),
  },
  {
    id: "seed-2",
    company: "Stripe",
    role: "React Developer",
    status: "Applied",
    appliedDate: "2025-04-05",
    location: "Remote",
    salary: "$160,000",
    notes: "",
    bookmarked: false,
    createdAt: new Date("2025-04-05").toISOString(),
  },
  {
    id: "seed-3",
    company: "Figma",
    role: "Product Engineer",
    status: "Offer",
    appliedDate: "2025-03-20",
    location: "San Francisco, CA",
    salary: "$175,000",
    notes: "Great culture fit interview. Offer deadline is April 30.",
    bookmarked: true,
    createdAt: new Date("2025-03-20").toISOString(),
  },
  {
    id: "seed-4",
    company: "Meta",
    role: "Software Engineer",
    status: "Rejected",
    appliedDate: "2025-03-15",
    location: "Menlo Park, CA",
    salary: "$195,000",
    notes: "Didn't pass the technical screen — study system design more.",
    bookmarked: false,
    createdAt: new Date("2025-03-15").toISOString(),
  },
  {
    id: "seed-5",
    company: "Vercel",
    role: "DevRel Engineer",
    status: "Interview",
    appliedDate: "2025-04-10",
    location: "Remote",
    salary: "$140,000",
    notes: "2nd round scheduled.",
    bookmarked: true,
    createdAt: new Date("2025-04-10").toISOString(),
  },
];

export function ApplicationProvider({ children }) {
  const [applications, setApplications] = useLocalStorage(
    "job_tracker_v1",
    SEED
  );

  // ── ADD ────────────────────────────────────────────────────────────────────
  const addApplication = useCallback(
    (data) => {
      const newApp = {
        ...data,
        id: crypto.randomUUID(),
        bookmarked: false,
        status: data.status || "Applied",
        createdAt: new Date().toISOString(),
      };
      setApplications((prev) => [newApp, ...prev]);
      return newApp;
    },
    [setApplications]
  );

  // ── EDIT ──────────────────────────────────────────────────────────────────
  const editApplication = useCallback(
    (id, updates) => {
      setApplications((prev) =>
        prev.map((app) => (app.id === id ? { ...app, ...updates } : app))
      );
    },
    [setApplications]
  );

  // ── DELETE ────────────────────────────────────────────────────────────────
  const deleteApplication = useCallback(
    (id) => {
      setApplications((prev) => prev.filter((app) => app.id !== id));
    },
    [setApplications]
  );

  // ── TOGGLE BOOKMARK ───────────────────────────────────────────────────────
  const toggleBookmark = useCallback(
    (id) => {
      setApplications((prev) =>
        prev.map((app) =>
          app.id === id ? { ...app, bookmarked: !app.bookmarked } : app
        )
      );
    },
    [setApplications]
  );

  // ── DERIVED STATS (consumed by Dashboard + Analytics pages) ───────────────
  const stats = {
    total:     applications.length,
    applied:   applications.filter((a) => a.status === "Applied").length,
    interview: applications.filter((a) => a.status === "Interview").length,
    offer:     applications.filter((a) => a.status === "Offer").length,
    rejected:  applications.filter((a) => a.status === "Rejected").length,
    bookmarked: applications.filter((a) => a.bookmarked).length,
  };

  return (
    <ApplicationContext.Provider
      value={{
        applications,
        addApplication,
        editApplication,
        deleteApplication,
        toggleBookmark,
        stats,
      }}
    >
      {children}
    </ApplicationContext.Provider>
  );
}
