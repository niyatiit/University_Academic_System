import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Sidebar() {
  const { user } = useAuth();
  const isMCA = user?.department === "MCA";

  const menuItems = [
    { name: "Dashboard", path: "/dashboard" },
    ...(isMCA ? [{ name: "Add Examiner", path: "/add-examiner" }] : []),
    { name: "Theory Examination", path: "/theory-examination" },
    { name: "Practical Examination", path: "/practical-examination" },
    { name: "Summary", path: "/summary" },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-200 min-h-[calc(100vh-72px)] py-6 px-4">
      <p className="text-xs uppercase tracking-wider text-slate-500 font-semibold px-3 mb-3">
        Menu
      </p>
      <nav className="flex flex-col gap-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
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
  );
}

export default Sidebar;