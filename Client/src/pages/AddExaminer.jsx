import { useState, useEffect } from "react";
import DashboardLayout from "../components/DashboardLayout";
import api from "../api/axios";

function AddExaminer() {
  const [examiners, setExaminers] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    designationTitle: "",
    rate: "",
    accountNumber: "",
    ifscCode: "",
    bankName: "",
  });
  const [editingId, setEditingId] = useState(null);
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

  const resetForm = () => {
    setFormData({
      name: "",
      designationTitle: "",
      rate: "",
      accountNumber: "",
      ifscCode: "",
      bankName: "",
    });
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      if (editingId) {
        await api.put(`/examiner/${editingId}`, formData);
        setMessage({ type: "success", text: "Examiner updated successfully" });
      } else {
        await api.post("/examiner/add", formData);
        setMessage({ type: "success", text: "Examiner added successfully" });
      }
      resetForm();
      fetchExaminers();
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Failed to save examiner",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (examiner) => {
    setFormData({
      name: examiner.name,
      designationTitle: examiner.designation?.title || "",
      rate: examiner.designation?.rate || "",
      accountNumber: examiner.accountNumber,
      ifscCode: examiner.ifscCode,
      bankName: examiner.bankName,
    });
    setEditingId(examiner._id);
    setMessage({ type: "", text: "" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this examiner?")) return;

    try {
      await api.delete(`/examiner/${id}`);
      setMessage({ type: "success", text: "Examiner deleted successfully" });
      fetchExaminers();
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Failed to delete examiner",
      });
    }
  };

  const handleCancelEdit = () => {
    resetForm();
    setMessage({ type: "", text: "" });
  };

  return (
    <DashboardLayout>
      <div className="p-8 max-w-5xl">
        <h1 className="text-2xl font-bold text-slate-800 mb-6">
          {editingId ? "Edit Examiner" : "Add Examiner"}
        </h1>

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

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                A/C No
              </label>
              <input
                type="text"
                name="accountNumber"
                value={formData.accountNumber}
                onChange={handleChange}
                placeholder="9-18 digit account number"
                pattern="[0-9]{9,18}"
                maxLength={18}
                className="w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                IFSC Code
              </label>
              <input
                type="text"
                name="ifscCode"
                value={formData.ifscCode}
                onChange={handleChange}
                placeholder="e.g. SBIN0001234"
                pattern="[A-Za-z]{4}0[A-Za-z0-9]{6}"
                maxLength={11}
                className="w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Bank Name
              </label>
              <input
                type="text"
                name="bankName"
                value={formData.bankName}
                onChange={handleChange}
                placeholder="Enter bank name"
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

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white font-medium py-2.5 px-6 rounded-md transition-colors"
            >
              {loading ? "Saving..." : editingId ? "Update Examiner" : "Add Examiner"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium py-2.5 px-6 rounded-md transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        {/* Table */}
        <div className="bg-white shadow-md rounded-lg overflow-x-auto">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead className="bg-slate-100 text-slate-700">
              <tr>
                <th className="px-4 py-3 font-semibold">Name</th>
                <th className="px-4 py-3 font-semibold">Designation</th>
                <th className="px-4 py-3 font-semibold">Rate</th>
                <th className="px-4 py-3 font-semibold">A/C No</th>
                <th className="px-4 py-3 font-semibold">IFSC</th>
                <th className="px-4 py-3 font-semibold">Bank</th>
                <th className="px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {examiners.map((examiner) => (
                <tr key={examiner._id} className="border-t border-slate-200">
                  <td className="px-4 py-3">{examiner.name}</td>
                  <td className="px-4 py-3">{examiner.designation?.title}</td>
                  <td className="px-4 py-3">₹{examiner.designation?.rate}</td>
                  <td className="px-4 py-3">{examiner.accountNumber}</td>
                  <td className="px-4 py-3">{examiner.ifscCode}</td>
                  <td className="px-4 py-3">{examiner.bankName}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(examiner)}
                        className="text-blue-600 hover:underline text-sm font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(examiner._id)}
                        className="text-red-600 hover:underline text-sm font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {examiners.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-6 text-center text-slate-400">
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