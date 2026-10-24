import { createContext, useContext, useState } from "react";

const YearContext = createContext();

const currentYear = new Date().getFullYear();
export const yearOptions = Array.from(
  { length: currentYear + 2 - 2026 },
  (_, i) => 2026 + i,
);

export function YearProvider({ children }) {
  const [year, setYearState] = useState(() => {
    const saved = Number(localStorage.getItem("selectedYear"));
    return yearOptions.includes(saved) ? saved : currentYear;
  });

  const setYear = (value) => {
    localStorage.setItem("selectedYear", String(value));
    setYearState(value);
  };

  return (
    <YearContext.Provider value={{ year, setYear }}>
      {children}
    </YearContext.Provider>
  );
}

export function useYear() {
  return useContext(YearContext);
}