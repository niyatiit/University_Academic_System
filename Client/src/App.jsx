import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
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
        <Route path="/" element={<Home/>}></Route>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/add-examiner"
          element={
            <ProtectedRoute>
              <AddExaminer />
            </ProtectedRoute>
          }
        />
        <Route
          path="/theory-examination"
          element={
            <ProtectedRoute>
              <TheoryExamination />
            </ProtectedRoute>
          }
        />
        <Route
          path="/practical-examination"
          element={
            <ProtectedRoute>
              <PracticalExamination />
            </ProtectedRoute>
          }
        />
        <Route
          path="/bank-details"
          element={
            <ProtectedRoute>
              <BankDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/summary"
          element={
            <ProtectedRoute>
              <Summary />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;