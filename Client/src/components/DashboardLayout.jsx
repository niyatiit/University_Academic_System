import Sidebar from "./Sidebar";
import { useYear, yearOptions } from "../context/YearContext";

function DashboardLayout({ children }) {
  const { year, setYear } = useYear();

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 bg-slate-50 min-h-[calc(100vh-72px)] pt-14 md:pt-0">
        <div className="flex items-center justify-end gap-2 px-4 sm:px-8 pt-4">
          <label className="text-sm font-medium text-slate-700">Year</label>
          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="border border-slate-300 rounded-md px-3 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {yearOptions.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
        {children}
      </main>
    </div>
  );
}

export default DashboardLayout;