import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AddExaminer from "./pages/AddExaminer";
import TheoryExamination from "./pages/TheoryExamination";
import PracticalExamination from "./pages/PracticalExamination";
import BankDetails from "./pages/BankDetails";
import Summary from "./pages/Summary";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/add-examiner" element={<AddExaminer />} />
        <Route path="/theory-examination" element={<TheoryExamination />} />
        <Route path="/practical-examination" element={<PracticalExamination />} />
        <Route path="/bank-details" element={<BankDetails />} />
        <Route path="/summary" element={<Summary />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;