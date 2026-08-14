import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-slate-800 text-white px-6 py-4 flex items-center justify-between shadow-md">
      <Link to="/" className="text-xl font-bold tracking-wide">
        Academic Payment Portal
      </Link>

      <div className="flex items-center gap-6">
        {user ? (
          <>
            <span className="text-sm text-slate-300">
              Hi, {user.username}
            </span>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 px-4 py-1.5 rounded-md text-sm font-medium transition-colors"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/" className="hover:text-blue-400 transition-colors">
              Login
            </Link>
            <Link
              to="/register"
              className="bg-blue-500 hover:bg-blue-600 px-4 py-1.5 rounded-md text-sm font-medium transition-colors"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;