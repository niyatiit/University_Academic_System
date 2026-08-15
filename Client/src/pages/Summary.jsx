import { useState, useEffect } from "react";
import DashboardLayout from "../components/DashboardLayout";
import api from "../api/axios";

const masterDepartments = ["MBA", "MCA"];
const allDepartments = ["BBA", "MBA", "BCA", "MCA", "JMC", "B.TECH", "BCOM"];

function Summary() {
  const [summary, setSummary] = useState([]);
  const [department, setDepartment] = useState("");
  const [semester, setSemester] = useState("");
  const [loading, setLoading] = useState(true);

  const maxSemester = masterDepartments.includes(department) ? 4 : 8;
  const semesterOptions = Array.from({ length: maxSemester }, (_, i) => i + 1);

  useEffect(() => {
    fetchSummary();
  }, [department, semester]);

  const fetchSummary = async () => {
    setLoading(true);
    try {
      const params = {};
      if (department) params.department = department;
      if (semester) params.semester = semester;

      const res = await api.get("/bank/summary", { params });
      setSummary(res.data.summary);
    } catch (err) {
      console.error("Failed to fetch summary:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDepartmentChange = (e) => {
    setDepartment(e.target.value);
    setSemester("");
  };

  const grandTotal = summary.reduce((sum, entry) => sum + entry.amount, 0);

  return (
    <DashboardLayout>
      <div className="p-8 max-w-5xl">
        <h1 className="text-2xl font-bold text-slate-800 mb-6">Summary</h1>

        {/* Filters */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-6 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Department
            </label>
            <select
              value={department}
              onChange={handleDepartmentChange}
              className="w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="">All Departments</option>
              {allDepartments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1">
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Semester
            </label>
            <select
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              disabled={!department}
              className="w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white disabled:bg-slate-100"
            >
              <option value="">
                {department ? "All Semesters" : "Select department first"}
              </option>
              {semesterOptions.map((sem) => (
                <option key={sem} value={sem}>
                  Semester {sem}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-100 text-slate-700">
              <tr>
                <th className="px-4 py-3 font-semibold">Name</th>
                <th className="px-4 py-3 font-semibold">A/C No</th>
                <th className="px-4 py-3 font-semibold">IFSC Code</th>
                <th className="px-4 py-3 font-semibold">Bank Name</th>
                <th className="px-4 py-3 font-semibold">Total Amount</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-slate-400">
                    Loading...
                  </td>
                </tr>
              ) : summary.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-slate-400">
                    No matching records found
                  </td>
                </tr>
              ) : (
                summary.map((entry) => (
                  <tr key={entry.examinerId} className="border-t border-slate-200">
                    <td className="px-4 py-3">{entry.name}</td>
                    <td className="px-4 py-3">{entry.accountNumber}</td>
                    <td className="px-4 py-3">{entry.ifscCode}</td>
                    <td className="px-4 py-3">{entry.bankName}</td>
                    <td className="px-4 py-3 font-semibold text-blue-600">
                      ₹{entry.amount.toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            {summary.length > 0 && (
              <tfoot>
                <tr className="border-t-2 border-slate-300 bg-slate-50">
                  <td colSpan={4} className="px-4 py-3 font-semibold text-slate-700 text-right">
                    Grand Total
                  </td>
                  <td className="px-4 py-3 font-bold text-blue-700">
                    ₹{grandTotal.toLocaleString()}
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Summary;