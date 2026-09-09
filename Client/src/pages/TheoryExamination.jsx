import { useState, useEffect } from "react";
import DashboardLayout from "../components/DashboardLayout";
import api from "../api/axios";
import { downloadFile } from "../utils/downloadFile";

function TheoryExamination() {
  const [examiners, setExaminers] = useState([]);
  const [entries, setEntries] = useState([]);
  const [formData, setFormData] = useState({
    examiner: "",
    designation: "",
    rate: "",
    totalDays: "",
    department: "",
    semester: "",
  });
  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const masterDepartments = ["MBA", "MCA"];
  const allDepartments = ["BBA", "MBA", "BCA", "MCA", "JMC", "B.TECH", "BCOM"];

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
  const rate = Number(formData.rate) || 0;
  const totalDaysNum = Number(formData.totalDays) || 0;
  const totalRemuneration = rate * totalDaysNum;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "department" ? { semester: "" } : {}), // reset semester when department changes
    }));
    setMessage({ type: "", text: "" });
  };

  const resetForm = () => {
    setFormData({
      examiner: "",
      designation: "",
      rate: "",
      totalDays: "",
      department: "",
      semester: "",
    });
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const res = editingId
        ? await api.put(`/theory/update/${editingId}`, formData)
        : await api.post("/theory/add", formData);
      setMessage({ type: "success", text: res.data.message });
      resetForm();
      fetchEntries();
    } catch (err) {
      console.log("Update error:", err.response); // 👈 add this line
      setMessage({
        type: "error",
        text:
          err.response?.data?.message ||
          `Failed to ${editingId ? "update" : "add"} entry`,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (entry) => {
    setEditingId(entry._id);
    setFormData({
      examiner: entry.examiner?._id || "",
      designation: entry.designation?.title || entry.designation || "",
      rate: entry.rate ?? "",
      totalDays: entry.totalDays ?? "",
      department: entry.department?.title || entry.department || "",
      semester: entry.semester ?? "",
    });
    setMessage({ type: "", text: "" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this entry? This cannot be undone.")) return;
    try {
      await api.delete(`/theory/delete/${id}`);
      if (editingId === id) resetForm();
      fetchEntries();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete entry");
    }
  };

  const maxSemester = masterDepartments.includes(formData.department) ? 4 : 8;
  const semesterOptions = Array.from({ length: maxSemester }, (_, i) => i + 1);

  return (
    <DashboardLayout>
      <div className="p-8 max-w-4xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-slate-800">
            Theory Examination
          </h1>
          <div className="flex gap-2">
            <button
              onClick={handleExportExcel}
              className="bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-4 py-2 rounded-md transition-colors"
            >
              Export Excel
            </button>
            <button
              onClick={handleExportPDF}
              className="bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-4 py-2 rounded-md transition-colors"
            >
              Export PDF
            </button>
          </div>
        </div>
        {editingId && (
          <div className="mb-4 flex items-center justify-between bg-amber-50 border border-amber-200 text-amber-800 text-sm font-medium rounded-md px-4 py-2">
            Editing entry — update the fields below and submit.
            <button
              type="button"
              onClick={resetForm}
              className="text-amber-700 hover:text-amber-900 underline"
            >
              Cancel edit
            </button>
          </div>
        )}
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
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                placeholder="Enter designation"
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
                placeholder="Enter rate"
                className="w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
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

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Department
              </label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                required
              >
                <option value="">Select Department</option>
                {allDepartments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Semester
              </label>
              <select
                name="semester"
                value={formData.semester}
                onChange={handleChange}
                disabled={!formData.department}
                className="w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white disabled:bg-slate-100"
                required
              >
                <option value="">
                  {formData.department
                    ? "Select Semester"
                    : "Select department first"}
                </option>
                {semesterOptions.map((sem) => (
                  <option key={sem} value={sem}>
                    Semester {sem}
                  </option>
                ))}
              </select>
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
            {loading
              ? editingId
                ? "Updating..."
                : "Submitting..."
              : editingId
                ? "Update Entry"
                : "Submit"}
          </button>
        </form>

        {/* Table */}
        <div className="bg-white shadow-md rounded-lg overflow-x-auto">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead className="bg-slate-100 text-slate-700">
              <tr>
                <th className="px-4 py-3 font-semibold">Examiner</th>
                <th className="px-4 py-3 font-semibold">Designation</th>
                <th className="px-4 py-3 font-semibold">Rate</th>
                <th className="px-4 py-3 font-semibold">Days</th>
                <th className="px-4 py-3 font-semibold">Total Remuneration</th>
                <th className="px-4 py-3 font-semibold">Department</th>
                <th className="px-4 py-3 font-semibold">Semester</th>
                <th className="px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry) => (
                <tr key={entry._id} className="border-t border-slate-200">
                  <td className="px-4 py-3">{entry.examiner?.name}</td>
                  <td className="px-4 py-3">
                    {entry.designation?.title || entry.designation}
                  </td>{" "}
                  <td className="px-4 py-3">₹{entry.rate}</td>
                  <td className="px-4 py-3">{entry.totalDays}</td>
                  <td className="px-4 py-3 font-semibold text-blue-600">
                    ₹{entry.totalRemuneration.toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    {entry.department?.title || entry.department}
                  </td>
                  <td className="px-4 py-3">{entry.semester}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => handleEdit(entry)}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(entry._id)}
                        className="text-red-600 hover:text-red-800 font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {entries.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-6 text-center text-slate-400"
                  >
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

const handleExportExcel = async () => {
  try {
    const res = await api.get("/theory/export/excel", { responseType: "blob" });
    downloadFile(res.data, "TheoryExamination.xlsx");
  } catch (err) {
    console.error("Excel export failed:", err);
  }
};

const handleExportPDF = async () => {
  try {
    const res = await api.get("/theory/export/pdf", { responseType: "blob" });
    downloadFile(res.data, "TheoryExamination.pdf");
  } catch (err) {
    console.error("PDF export failed:", err);
  }
};
export default TheoryExamination;
