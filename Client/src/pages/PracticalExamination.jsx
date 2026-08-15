import { useState, useEffect } from "react";
import DashboardLayout from "../components/DashboardLayout";
import api from "../api/axios";
import { downloadFile } from "../utils/downloadFile";

function PracticalExamination() {
  const [examiners, setExaminers] = useState([]);
  const [entries, setEntries] = useState([]);
  const [formData, setFormData] = useState({
    examiner: "",
    totalDays: "",
    date: "",
    subjectCode: "",
    personName: "",
    ta: "",
    da: "",
    honorarium: "",
    department: "",
    semester: "",
  });
  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);
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
      const res = await api.get("/practical/all");
      setEntries(res.data.practicalExams);
    } catch (err) {
      console.error("Failed to fetch practical entries:", err);
    }
  };

  const selectedExaminer = examiners.find((ex) => ex._id === formData.examiner);
  const rate = selectedExaminer ? selectedExaminer.designation.rate : 0;
  const totalDaysNum = Number(formData.totalDays) || 0;
  const taNum = Number(formData.ta) || 0;
  const daNum = Number(formData.da) || 0;
  const honorariumNum = Number(formData.honorarium) || 0;
  const total = rate * totalDaysNum + taNum + daNum + honorariumNum;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "department" ? { semester: "" } : {}),
    }));
    setMessage({ type: "", text: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const res = await api.post("/practical/add", formData);
      setMessage({ type: "success", text: res.data.message });
      setFormData({
        examiner: "",
        totalDays: "",
        date: "",
        subjectCode: "",
        personName: "",
        ta: "",
        da: "",
        honorarium: "",
        department: "",
        semester: "",
      });
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

  const maxSemester = masterDepartments.includes(formData.department) ? 4 : 8;
  const semesterOptions = Array.from({ length: maxSemester }, (_, i) => i + 1);
  return (
    <DashboardLayout>
      <div className="p-8 max-w-5xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-slate-800">
            Practical Examination
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

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded-lg p-6 flex flex-col gap-4 mb-8"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
                value={
                  selectedExaminer ? selectedExaminer.designation.title : ""
                }
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
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Date
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Subject Code
              </label>
              <input
                type="text"
                name="subjectCode"
                value={formData.subjectCode}
                onChange={handleChange}
                placeholder="Enter subject code"
                className="w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Name of Person{" "}
                <span className="text-slate-400 font-normal">(optional)</span>
              </label>
              <input
                type="text"
                name="personName"
                value={formData.personName}
                onChange={handleChange}
                placeholder="Enter name (optional)"
                className="w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Amount of TA
              </label>
              <input
                type="number"
                name="ta"
                min="0"
                value={formData.ta}
                onChange={handleChange}
                placeholder="Enter TA amount"
                className="w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Amount of DA
              </label>
              <input
                type="number"
                name="da"
                min="0"
                value={formData.da}
                onChange={handleChange}
                placeholder="Enter DA amount"
                className="w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Amount of Honorarium
              </label>
              <input
                type="number"
                name="honorarium"
                min="0"
                value={formData.honorarium}
                onChange={handleChange}
                placeholder="Enter honorarium amount"
                className="w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Live Total */}
          <div className="bg-blue-50 border border-blue-200 rounded-md px-4 py-3 flex items-center justify-between">
            <span className="text-sm font-medium text-slate-700">
              Total (Rate × Days + TA + DA + Honorarium)
            </span>
            <span className="text-lg font-bold text-blue-600">
              ₹{total.toLocaleString()}
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
        <div className="bg-white shadow-md rounded-lg overflow-x-auto">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead className="bg-slate-100 text-slate-700">
              <tr>
                <th className="px-4 py-3 font-semibold">Examiner</th>
                <th className="px-4 py-3 font-semibold">Designation</th>
                <th className="px-4 py-3 font-semibold">Rate</th>
                <th className="px-4 py-3 font-semibold">Days</th>
                <th className="px-4 py-3 font-semibold">Date</th>
                <th className="px-4 py-3 font-semibold">Subject Code</th>
                <th className="px-4 py-3 font-semibold">Person</th>
                <th className="px-4 py-3 font-semibold">TA</th>
                <th className="px-4 py-3 font-semibold">DA</th>
                <th className="px-4 py-3 font-semibold">Honorarium</th>
                <th className="px-4 py-3 font-semibold">Total</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry) => (
                <tr key={entry._id} className="border-t border-slate-200">
                  <td className="px-4 py-3">{entry.examiner?.name}</td>
                  <td className="px-4 py-3">{entry.designation?.title}</td>
                  <td className="px-4 py-3">₹{entry.rate}</td>
                  <td className="px-4 py-3">{entry.totalDays}</td>
                  <td className="px-4 py-3">
                    {new Date(entry.date).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">{entry.subjectCode}</td>
                  <td className="px-4 py-3">{entry.personName || "-"}</td>
                  <td className="px-4 py-3">₹{entry.ta}</td>
                  <td className="px-4 py-3">₹{entry.da}</td>
                  <td className="px-4 py-3">₹{entry.honorarium}</td>
                  <td className="px-4 py-3 font-semibold text-blue-600">
                    ₹{entry.total.toLocaleString()}
                  </td>
                </tr>
              ))}
              {entries.length === 0 && (
                <tr>
                  <td
                    colSpan={11}
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
    const res = await api.get("/practical/export/excel", {
      responseType: "blob",
    });
    downloadFile(res.data, "PracticalExamination.xlsx");
  } catch (err) {
    console.error("Excel export failed:", err);
  }
};

const handleExportPDF = async () => {
  try {
    const res = await api.get("/practical/export/pdf", {
      responseType: "blob",
    });
    downloadFile(res.data, "PracticalExamination.pdf");
  } catch (err) {
    console.error("PDF export failed:", err);
  }
};

export default PracticalExamination;
