// ─── useLocalStorage ─────────────────────────────────────────────────────────
// Mirrors useState but reads/writes localStorage so data survives page refresh.
import { useState, useEffect } from "react";

export function useLocalStorage(key, initialVal) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialVal;
    } catch (err) {
      console.error("useLocalStorage read error:", err);
      return initialVal;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (err) {
      console.error("useLocalStorage write error:", err);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}
