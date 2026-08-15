import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="bg-slate-50">
      {/* Hero Section */}
      <div className="max-w-5xl mx-auto px-6 py-20 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold text-slate-800 mb-4">
          Academic Payment Portal
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-8">
          A simple, centralized system to manage examiner remuneration for
          theory and practical examinations — from tracking exam duty
          payments to storing bank details for disbursement, all in one
          place.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link
            to="/login"
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-6 py-3 rounded-md transition-colors"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="bg-white hover:bg-slate-100 text-slate-800 font-medium px-6 py-3 rounded-md border border-slate-300 transition-colors"
          >
            Register
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-5xl mx-auto px-6 pb-20">
        <h2 className="text-2xl font-bold text-slate-800 text-center mb-10">
          What you can do here
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
            <h3 className="font-semibold text-slate-800 mb-2">
              📋 Theory Examination
            </h3>
            <p className="text-sm text-slate-600">
              Record examiner duty days and automatically calculate
              remuneration based on designation rate.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
            <h3 className="font-semibold text-slate-800 mb-2">
              🧪 Practical Examination
            </h3>
            <p className="text-sm text-slate-600">
              Track practical exam duties along with TA, DA, and Honorarium
              — with instant total calculation.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
            <h3 className="font-semibold text-slate-800 mb-2">
              🏦 Bank Details
            </h3>
            <p className="text-sm text-slate-600">
              Store examiner bank account details with automatically
              calculated total payable amount, safeguarded against
              duplicate entries.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
            <h3 className="font-semibold text-slate-800 mb-2">
              👤 Examiner Management
            </h3>
            <p className="text-sm text-slate-600">
              Add and manage examiners along with their designation and
              per-day rate.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
            <h3 className="font-semibold text-slate-800 mb-2">
              📊 Summary Reports
            </h3>
            <p className="text-sm text-slate-600">
              View a consolidated summary of all payments with quick search
              and grand total.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
            <h3 className="font-semibold text-slate-800 mb-2">
              📥 Export Reports
            </h3>
            <p className="text-sm text-slate-600">
              Download examination and payment records as Excel or PDF for
              record-keeping and printing.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;