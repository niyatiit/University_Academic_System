import { useState, useEffect, useMemo } from "react";
import DashboardLayout from "../components/DashboardLayout";
import api from "../api/axios";

function Summary() {
  const [bankDetails, setBankDetails] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    try {
      const res = await api.get("/bank/all");
      setBankDetails(res.data.bankDetails);
    } catch (err) {
      console.error("Failed to fetch summary:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredData = useMemo(() => {
    if (!search.trim()) return bankDetails;

    const query = search.toLowerCase();
    return bankDetails.filter(
      (entry) =>
        entry.examiner?.name?.toLowerCase().includes(query) ||
        entry.accountNumber.toLowerCase().includes(query) ||
        entry.bankName.toLowerCase().includes(query)
    );
  }, [search, bankDetails]);

  const grandTotal = filteredData.reduce((sum, entry) => sum + entry.amount, 0);

  return (
    <DashboardLayout>
      <div className="p-8 max-w-5xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-slate-800">Summary</h1>

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, A/C no, or bank..."
            className="border border-slate-300 rounded-md px-3 py-2 w-72 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

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
              ) : filteredData.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-slate-400">
                    No matching records found
                  </td>
                </tr>
              ) : (
                filteredData.map((entry) => (
                  <tr key={entry._id} className="border-t border-slate-200">
                    <td className="px-4 py-3">{entry.examiner?.name}</td>
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
            {filteredData.length > 0 && (
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