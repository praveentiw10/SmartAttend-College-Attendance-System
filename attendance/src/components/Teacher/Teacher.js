import React, { useEffect } from 'react'
import Header from '../header/Header'
import { useNavigate } from 'react-router-dom';
import Footer from '../Footer/Footer';


const Teacher = () => {
  const navigate = useNavigate();
  useEffect(() => {
    if (localStorage.getItem('token') == null || localStorage.getItem('type') !== 'teacher') {
      navigate('/login');
    }

  }, []);
  return (
    <div>
      <Header />
      <section className="text-gray-600 body-font">
        <div className="container px-5 py-16 mx-auto">
          <div className="flex flex-col text-center w-full mb-12">
            <p className="uppercase tracking-[0.2em] text-xs text-emerald-600 font-semibold">Teacher Dashboard</p>
            <h1 className="section-title mt-2">Welcome to the Attendance Portal</h1>
            <p className="lg:w-2/3 mx-auto leading-relaxed text-base text-slate-500 mt-2">A complete digital solution to maintain attendance records.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-panel card-hover p-6 flex flex-col justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-900 mb-2 text-center">View Attendance</h2>
                <p className="leading-relaxed text-center mb-6 text-slate-500">View and delete attendance records.</p>
              </div>
              <a className="mx-auto" href='/viewAttendance'>
                <button className="primary-btn">
                  View Records
                </button>
              </a>
            </div>
            <div className="glass-panel card-hover p-6 flex flex-col justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-900 mb-2 text-center">Take Attendance</h2>
                <p className="leading-relaxed text-center mb-6 text-slate-500">Take subject wise attendance.</p>
              </div>
              <a className="mx-auto" href='/takeAttendance'>
                <button className="primary-btn">
                  Start Now
                </button>
              </a>
            </div>
          </div>
        </div>
      </section>
      <div className='mt-8'>
        <Footer />
      </div>
    </div>
  )
}

export default Teacher
