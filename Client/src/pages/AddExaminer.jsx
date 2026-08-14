import { useState, useEffect } from "react";
import DashboardLayout from "../components/DashboardLayout";
import api from "../api/axios";

function AddExaminer() {
  const [examiners, setExaminers] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    designationTitle: "",
    rate: "",
  });
  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchExaminers();
  }, []);

  const fetchExaminers = async () => {
    try {
      const res = await api.get("/examiner/all");
      setExaminers(res.data);
    } catch (err) {
      console.error("Failed to fetch examiners:", err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setMessage({ type: "", text: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      await api.post("/examiner/add", formData);
      setMessage({ type: "success", text: "Examiner added successfully" });
      setFormData({ name: "", designationTitle: "", rate: "" });
      fetchExaminers(); // refresh table
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Failed to add examiner",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-8 max-w-4xl">
        <h1 className="text-2xl font-bold text-slate-800 mb-6">Add Examiner</h1>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded-lg p-6 flex flex-col gap-4 mb-8"
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Examiner Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter examiner name"
                className="w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Designation
              </label>
              <input
                type="text"
                name="designationTitle"
                value={formData.designationTitle}
                onChange={handleChange}
                placeholder="e.g. Professor"
                className="w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Rate (₹/day)
              </label>
              <input
                type="number"
                name="rate"
                min="0"
                value={formData.rate}
                onChange={handleChange}
                placeholder="e.g. 500"
                className="w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <p className="text-xs text-slate-500">
            If this designation already exists, its rate will be updated to the new value you enter.
          </p>

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
            {loading ? "Adding..." : "Add Examiner"}
          </button>
        </form>

        {/* Table */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-100 text-slate-700">
              <tr>
                <th className="px-4 py-3 font-semibold">Name</th>
                <th className="px-4 py-3 font-semibold">Designation</th>
                <th className="px-4 py-3 font-semibold">Rate (₹/day)</th>
              </tr>
            </thead>
            <tbody>
              {examiners.map((examiner) => (
                <tr key={examiner._id} className="border-t border-slate-200">
                  <td className="px-4 py-3">{examiner.name}</td>
                  <td className="px-4 py-3">{examiner.designation?.title}</td>
                  <td className="px-4 py-3">₹{examiner.designation?.rate}</td>
                </tr>
              ))}
              {examiners.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-4 py-6 text-center text-slate-400">
                    No examiners added yet
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

export default AddExaminer;