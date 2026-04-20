// ─── useApplications ─────────────────────────────────────────────────────────
// Convenience hook — components call this instead of importing the context.
import { useContext } from "react";
import { ApplicationContext } from "../context/ApplicationContext";

export function useApplications() {
  const ctx = useContext(ApplicationContext);
  if (!ctx) {
    throw new Error("useApplications must be used inside <ApplicationProvider>");
  }
  return ctx;
}
