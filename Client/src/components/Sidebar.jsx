import { NavLink } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

function Sidebar() {
  const { user } = useAuth();
  const isMCA = user?.department === "MCA";
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { name: "Dashboard", path: "/dashboard" },
    ...(isMCA ? [{ name: "Add Examiner", path: "/add-examiner" }] : []),
    { name: "Theory Examination", path: "/theory-examination" },
    { name: "Practical Examination", path: "/practical-examination" },
    { name: "Summary", path: "/summary" },
  ];

  return (
    <>
      {/* Mobile hamburger button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-[80px] left-3 z-40 bg-slate-900 text-white p-2 rounded-md"
      >
        {isOpen ? "✕" : "☰"}
      </button>

      {/* Overlay on mobile when sidebar is open */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="md:hidden fixed inset-0 bg-black/40 z-20"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          w-64 bg-slate-900 text-slate-200 py-6 px-4
          fixed md:static top-[72px] left-0 h-[calc(100vh-72px)] md:h-auto md:min-h-[calc(100vh-72px)]
          z-30 transform transition-transform duration-200
          ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0
        `}
      >
        <p className="text-xs uppercase tracking-wider text-slate-500 font-semibold px-3 mb-3">
          Menu
        </p>
        <nav className="flex flex-col gap-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `px-4 py-2.5 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-blue-500 text-white"
                    : "hover:bg-slate-800 text-slate-300"
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}

export default Sidebar;