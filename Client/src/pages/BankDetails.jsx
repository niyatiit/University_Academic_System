import { useState, useEffect } from "react";
import DashboardLayout from "../components/DashboardLayout";
import api from "../api/axios";
import { downloadFile } from "../utils/downloadFile";

function BankDetails() {
  const [eligibleExaminers, setEligibleExaminers] = useState([]);
  const [bankEntries, setBankEntries] = useState([]);
  const [formData, setFormData] = useState({
    examiner: "",
    accountNumber: "",
    ifscCode: "",
    bankName: "",
  });
  const [amount, setAmount] = useState(0);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchEligibleExaminers();
    fetchBankEntries();
  }, []);

  const fetchEligibleExaminers = async () => {
    try {
      const res = await api.get("/bank/examiners");
      setEligibleExaminers(res.data.examiners);
    } catch (err) {
      console.error("Failed to fetch eligible examiners:", err);
    }
  };

  const fetchBankEntries = async () => {
    try {
      const res = await api.get("/bank/all");
      setBankEntries(res.data.bankDetails);
    } catch (err) {
      console.error("Failed to fetch bank details:", err);
    }
  };

  const fetchAmountForExaminer = async (examinerId) => {
    try {
      const res = await api.get(`/bank/amount/${examinerId}`);
      setAmount(res.data.totalAmount);
    } catch (err) {
      console.error("Failed to fetch amount:", err);
      setAmount(0);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setMessage({ type: "", text: "" });

    if (name === "examiner") {
      if (value) {
        fetchAmountForExaminer(value);
      } else {
        setAmount(0);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const res = await api.post("/bank/add", formData);
      setMessage({ type: "success", text: res.data.message });
      setFormData({
        examiner: "",
        accountNumber: "",
        ifscCode: "",
        bankName: "",
      });
      setAmount(0);
      fetchBankEntries(); // refresh table
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Failed to add bank details",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-8 max-w-4xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-slate-800">Bank Details</h1>
          <button
            onClick={handleExportPDF}
            className="bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-4 py-2 rounded-md transition-colors"
          >
            Export PDF
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded-lg p-6 flex flex-col gap-4 mb-8"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Name
              </label>
              <select
                name="examiner"
                value={formData.examiner}
                onChange={handleChange}
                className="w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                required
              >
                <option value="">Select Examiner</option>
                {eligibleExaminers.map((ex) => (
                  <option key={ex._id} value={ex._id}>
                    {ex.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Amount
              </label>
              <input
                type="text"
                value={formData.examiner ? `₹${amount.toLocaleString()}` : ""}
                readOnly
                placeholder="Auto-calculated"
                className="w-full border border-slate-300 rounded-md px-3 py-2 bg-slate-100 text-slate-600 font-semibold"
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
                placeholder="Enter account number"
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
                placeholder="Enter IFSC code"
                className="w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase"
                required
              />
            </div>

            <div className="sm:col-span-2">
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
                <th className="px-4 py-3 font-semibold">Name</th>
                <th className="px-4 py-3 font-semibold">A/C No</th>
                <th className="px-4 py-3 font-semibold">IFSC Code</th>
                <th className="px-4 py-3 font-semibold">Bank Name</th>
                <th className="px-4 py-3 font-semibold">Amount</th>
              </tr>
            </thead>
            <tbody>
              {bankEntries.map((entry) => (
                <tr key={entry._id} className="border-t border-slate-200">
                  <td className="px-4 py-3">{entry.examiner?.name}</td>
                  <td className="px-4 py-3">{entry.accountNumber}</td>
                  <td className="px-4 py-3">{entry.ifscCode}</td>
                  <td className="px-4 py-3">{entry.bankName}</td>
                  <td className="px-4 py-3 font-semibold text-blue-600">
                    ₹{entry.amount.toLocaleString()}
                  </td>
                </tr>
              ))}
              {bankEntries.length === 0 && (
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

const handleExportPDF = async () => {
  try {
    const res = await api.get("/bank/export/pdf", { responseType: "blob" });
    downloadFile(res.data, "BankDetails.pdf");
  } catch (err) {
    console.error("PDF export failed:", err);
  }
};
export default BankDetails;
