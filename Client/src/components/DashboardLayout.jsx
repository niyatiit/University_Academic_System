import Sidebar from "./Sidebar";

function DashboardLayout({ children }) {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 bg-slate-50 min-h-[calc(100vh-72px)]">
        {children}
      </main>
    </div>
  );
}

export default DashboardLayout;