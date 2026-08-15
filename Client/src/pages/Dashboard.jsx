import { Link } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import { useAuth } from "../context/AuthContext";

const modules = [
  {
    title: "Add Examiner",
    description: "Add examiners along with their designation and per-day rate.",
    icon: "👤",
    path: "/add-examiner",
  },
  {
    title: "Theory Examination",
    description: "Record theory exam duty days and auto-calculate remuneration.",
    icon: "📋",
    path: "/theory-examination",
  },
  {
    title: "Practical Examination",
    description: "Record practical duties along with TA, DA, and Honorarium.",
    icon: "🧪",
    path: "/practical-examination",
  },
  {
    title: "Bank Details",
    description: "Add examiner bank details with auto-calculated total payable amount.",
    icon: "🏦",
    path: "/bank-details",
  },
  {
    title: "Summary",
    description: "View a consolidated summary of all payments with search and totals.",
    icon: "📊",
    path: "/summary",
  },
];

function Dashboard() {
  const { user } = useAuth();

  return (
    <DashboardLayout>
      <div className="p-8">
        <h1 className="text-2xl font-bold text-slate-800 mb-2">
          Welcome back, {user?.username} 👋
        </h1>
        <p className="text-slate-600 mb-8">
          Use the cards below or the sidebar menu to manage examiners, exam
          duty payments, bank details, and view summary reports.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {modules.map((mod) => (
            <Link
              key={mod.path}
              to={mod.path}
              className="bg-white border border-slate-200 rounded-lg shadow-sm hover:shadow-md hover:border-blue-300 transition-all p-6 block"
            >
              <div className="text-3xl mb-3">{mod.icon}</div>
              <h3 className="font-semibold text-slate-800 mb-1">
                {mod.title}
              </h3>
              <p className="text-sm text-slate-600">{mod.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Dashboard;