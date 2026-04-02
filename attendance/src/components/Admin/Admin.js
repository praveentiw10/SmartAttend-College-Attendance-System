import React, { useEffect } from 'react'
import Header from '../header/Header'
import { useNavigate } from 'react-router-dom';


const Admin = () => {
  const navigate = useNavigate();
  useEffect(() => {
    if (localStorage.getItem('token') == null || localStorage.getItem('type') !== 'admin') {
      navigate('/adminLogin');
    }
  }, []);

  const getAllSubj = async ()=>{
    
  }
  useEffect(() => {
    
   
  }, []);
  return (
    <div>
      <Header />
      <section className="text-gray-600 body-font">
        <div className="container px-5 py-16 mx-auto">
          <div className="flex flex-col text-center w-full mb-12">
            <p className="uppercase tracking-[0.2em] text-xs text-emerald-600 font-semibold">Admin Dashboard</p>
            <h1 className="section-title mt-2">Welcome Admin</h1>
            <p className="lg:w-2/3 mx-auto leading-relaxed text-base text-slate-500 mt-2">Manage students, faculty, subjects, and attendance records.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            <div className="glass-panel card-hover p-6 cursor-pointer" onClick={() => {
              navigate('/viewProff')
            }}>
              <h2 className="text-lg font-semibold text-slate-900 mb-2">View Professors</h2>
              <p className="leading-relaxed text-sm text-slate-500">View details of professors.</p>
            </div>
            <div className="glass-panel card-hover p-6 cursor-pointer" onClick={() => {
              navigate('/viewStudents')
            }}>
              <h2 className="text-lg font-semibold text-slate-900 mb-2">View Students</h2>
              <p className="leading-relaxed text-sm text-slate-500">View details of students.</p>
            </div>
            <div className="glass-panel card-hover p-6 cursor-pointer" onClick={() => {
              navigate('/viewAttendAdm')
            }}>
              <h2 className="text-lg font-semibold text-slate-900 mb-2">Attendance</h2>
              <p className="leading-relaxed text-sm text-slate-500">View and update attendance records.</p>
            </div>
            <div className="glass-panel card-hover p-6 cursor-pointer" onClick={() => {
              navigate('/viewSubjs')
            }}>
              <h2 className="text-lg font-semibold text-slate-900 mb-2">Manage Subjects</h2>
              <p className="leading-relaxed text-sm text-slate-500">Add, update, or remove subjects.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Admin
