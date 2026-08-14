import DashboardLayout from "../components/DashboardLayout";

function Dashboard() {
  return (
    <DashboardLayout>
      <div className="p-8">
        <h1 className="text-2xl font-bold text-slate-800 mb-2">
          Welcome to Academic Payment Portal
        </h1>
        <p className="text-slate-600">
          Use the menu on the left to manage examiners, theory & practical
          examinations, bank details, and view summary reports.
        </p>
      </div>
    </DashboardLayout>
  );
}

export default Dashboard;