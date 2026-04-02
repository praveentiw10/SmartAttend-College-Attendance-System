import React, { useEffect, useState } from "react";
import LogoutIcon from "@mui/icons-material/Logout";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const [profileType, setProfileType] = useState(null);

  useEffect(() => {
    const type = localStorage.getItem("type");
    setProfileType(type);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("type");
    setProfileType(null);
    navigate("/");
  };

  return (
    <div>
      <header className="border-b border-slate-200 bg-white/70 backdrop-blur sticky top-0 z-40">
        <div className="container mx-auto flex flex-wrap px-6 py-4 flex-col md:flex-row items-center">
          <div className="flex title-font font-medium items-center mb-4 md:mb-0">
            <img
              src="https://cdn.freelogovectors.net/wp-content/uploads/2022/03/parul-university-logo_freelogovectors.net_.png"
              alt=""
              className="w-22 h-12 rounded-20l ring-2 ring-white shadow-sm"
            />
            <div className="flex flex-col">
              <Link to="/" className="hover:cursor-pointer flex flex-col">
                <div className="ml-3 text-xl text-slate-900">
                  SmartAttend – College Attendance Management System
                </div>
              </Link>
              <h2 className="ml-3 text-emerald-600 text-sm">
                Parul University
              </h2>
            </div>
          </div>

          {profileType === "student" && (
            <nav className="md:ml-auto flex flex-wrap items-center text-base justify-center" />
          )}

          {profileType === "teacher" && (
            <nav className="md:ml-auto flex flex-wrap items-center text-sm justify-center text-slate-700">
              <Link
                className="mr-5 hover:text-slate-900 hover:cursor-pointer hover:text-blue-600 transition"
                to="/takeAttendance"
              >
                Take Attendance
              </Link>
              <Link
                className="mr-5 hover:text-slate-900 hover:cursor-pointer hover:text-blue-600 transition"
                to="/viewAttendance"
              >
                View Attendance
              </Link>
            </nav>
          )}

          {profileType === "admin" && (
            <nav className="md:ml-auto flex flex-wrap items-center text-sm justify-center text-slate-700">
              <Link
                className="mr-5 hover:text-slate-900 hover:cursor-pointer hover:text-blue-600 transition"
                to="/viewStudents"
              >
                Students
              </Link>
              <Link
                className="mr-5 hover:text-slate-900 hover:cursor-pointer hover:text-blue-600 transition"
                to="/viewProff"
              >
                Faculty
              </Link>
              <Link
                className="mr-5 hover:text-slate-900 hover:cursor-pointer hover:text-blue-600 transition"
                to="/viewAttendAdm"
              >
                Attendance
              </Link>
            </nav>
          )}

          {profileType && (
            <button
              onClick={handleLogout}
              className="inline-flex items-center bg-slate-900 text-white border-0 py-2 px-4 focus:outline-none hover:bg-slate-800 rounded-full text-sm mt-4 md:mt-0"
            >
              Logout
              <LogoutIcon fontSize="small" />
            </button>
          )}
        </div>
      </header>
    </div>
  );
};

export default Header;
