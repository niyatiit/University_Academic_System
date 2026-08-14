import { useState, useEffect } from "react";
import DashboardLayout from "../components/DashboardLayout";
import api from "../api/axios";

function TheoryExamination() {
  const [examiners, setExaminers] = useState([]);
  const [entries, setEntries] = useState([]);
  const [formData, setFormData] = useState({
    examiner: "",
    totalDays: "",
  });
  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchExaminers();
    fetchEntries();
  }, []);

  const fetchExaminers = async () => {
    try {
      const res = await api.get("/examiner/all");
      setExaminers(res.data);
    } catch (err) {
      console.error("Failed to fetch examiners:", err);
    }
  };

  const fetchEntries = async () => {
    try {
      const res = await api.get("/theory/all");
      setEntries(res.data.theoryExams);
    } catch (err) {
      console.error("Failed to fetch theory entries:", err);
    }
  };

  const selectedExaminer = examiners.find((ex) => ex._id === formData.examiner);
  const rate = selectedExaminer ? selectedExaminer.designation.rate : 0;
  const totalDaysNum = Number(formData.totalDays) || 0;
  const totalRemuneration = rate * totalDaysNum;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setMessage({ type: "", text: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const res = await api.post("/theory/add", formData);
      setMessage({ type: "success", text: res.data.message });
      setFormData({ examiner: "", totalDays: "" });
      fetchEntries(); // refresh table
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Failed to add entry",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-8 max-w-4xl">
        <h1 className="text-2xl font-bold text-slate-800 mb-6">
          Theory Examination
        </h1>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded-lg p-6 flex flex-col gap-4 mb-8"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Examiner Name
              </label>
              <select
                name="examiner"
                value={formData.examiner}
                onChange={handleChange}
                className="w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                required
              >
                <option value="">Select Examiner</option>
                {examiners.map((ex) => (
                  <option key={ex._id} value={ex._id}>
                    {ex.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Designation
              </label>
              <input
                type="text"
                value={selectedExaminer ? selectedExaminer.designation.title : ""}
                readOnly
                placeholder="Auto-filled"
                className="w-full border border-slate-300 rounded-md px-3 py-2 bg-slate-100 text-slate-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Rate (₹/day)
              </label>
              <input
                type="text"
                value={selectedExaminer ? `₹${rate}` : ""}
                readOnly
                placeholder="Auto-filled"
                className="w-full border border-slate-300 rounded-md px-3 py-2 bg-slate-100 text-slate-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Total Days
              </label>
              <input
                type="number"
                name="totalDays"
                min="1"
                value={formData.totalDays}
                onChange={handleChange}
                placeholder="Enter total days"
                className="w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          {/* Live Total Remuneration */}
          <div className="bg-blue-50 border border-blue-200 rounded-md px-4 py-3 flex items-center justify-between">
            <span className="text-sm font-medium text-slate-700">
              Total Remuneration
            </span>
            <span className="text-lg font-bold text-blue-600">
              ₹{totalRemuneration.toLocaleString()}
            </span>
          </div>

          {message.text && (
            <p
              className={`text-sm font-medium ${
                message.type === "success" ? "text-green-600" : "text-red-600"
              }`}
            >
              {message.text}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white font-medium py-2.5 px-6 rounded-md self-start transition-colors"
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </form>

        {/* Table */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-100 text-slate-700">
              <tr>
                <th className="px-4 py-3 font-semibold">Examiner</th>
                <th className="px-4 py-3 font-semibold">Designation</th>
                <th className="px-4 py-3 font-semibold">Rate</th>
                <th className="px-4 py-3 font-semibold">Days</th>
                <th className="px-4 py-3 font-semibold">Total Remuneration</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry) => (
                <tr key={entry._id} className="border-t border-slate-200">
                  <td className="px-4 py-3">{entry.examiner?.name}</td>
                  <td className="px-4 py-3">{entry.designation?.title}</td>
                  <td className="px-4 py-3">₹{entry.rate}</td>
                  <td className="px-4 py-3">{entry.totalDays}</td>
                  <td className="px-4 py-3 font-semibold text-blue-600">
                    ₹{entry.totalRemuneration.toLocaleString()}
                  </td>
                </tr>
              ))}
              {entries.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-slate-400">
                    No entries yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default TheoryExamination;