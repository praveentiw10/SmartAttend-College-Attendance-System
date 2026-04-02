import React, { useState, useEffect } from 'react';
import LockIcon from '@mui/icons-material/Lock';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Link from '@mui/material/Link';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import Header from '../header/Header';
import { path } from '../../path';

const axios = require('axios');

const Login = () => {
    const [value, setValue] = useState('1');
    const [roll, setRoll] = useState('');
    const [email, setEmail] = useState('');
    const [studentPwd, setStudentPwd] = useState('');
    const [teacherPwd, setTeacherPwd] = useState('');

    const navigate = useNavigate();

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleStudentLogin = (e) => {
        e.preventDefault();

        if (roll.length && studentPwd.length) {
            axios
                .post(`${path}/loginStudent`, {
                    roll: roll,
                    password: studentPwd,
                })
                .then((response) => {
                    if (response.status === 203) {
                        toast.error(response.data.msg);
                    } else {
                        toast.success(response.data.msg);
                        localStorage.setItem('token', response.data.data);
                        localStorage.setItem('type', 'student');
                        setTimeout(() => navigate('/student'), 2000);
                    }
                })
                .catch((error) => {
                    const msg =
                        error?.response?.data?.msg ||
                        'Login failed. Please try again.';
                    toast.error(msg);
                    console.log(error);
                });
        } else {
            toast.warn('Please fill all the details carefully!!');
        }
    };

    const handleTeacherLogin = (e) => {
        e.preventDefault();

        if (email.length && teacherPwd.length) {
            axios
                .post(`${path}/loginTeacher`, {
                    email: email,
                    password: teacherPwd,
                })
                .then((response) => {
                    if (response.status === 203) {
                        toast.error(response.data.msg);
                    } else {
                        toast.success(response.data.msg);
                        localStorage.setItem('token', response.data.data);
                        localStorage.setItem('type', 'teacher');
                        setTimeout(() => navigate('/teacher'), 2000);
                    }
                })
                .catch((error) => {
                    const msg =
                        error?.response?.data?.msg ||
                        'Login failed. Please try again.';
                    toast.error(msg);
                    console.log(error);
                });
        } else {
            toast.warn('Please fill all the details carefully!!');
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        const type = localStorage.getItem('type');

        if (token) {
            if (type === 'teacher') navigate('/teacher');
            else if (type === 'student') navigate('/student');
            else if (type === 'admin') navigate('/admin');
        }
    }, [navigate]);

    return (
        <div>
             <Header />

            <ToastContainer
                position="top-right"
                autoClose={2000}
                hideProgressBar={false}
                pauseOnHover
            />

            <div className="relative overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                        backgroundImage:
                            'url("https://theliveahmedabad.com/wp-content/uploads/2023/02/WhatsApp-Image-2023-02-24-at-11.54.33-AM.jpeg")',
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900/70 via-slate-900/60 to-emerald-900/50" />
                <div className="relative flex justify-center items-center py-16 px-[6%]">
                    <div className="w-full max-w-md glass-panel p-8">
                        <div className="text-center mb-6">
                            <p className="uppercase tracking-[0.2em] text-xs text-emerald-600 font-semibold">
                                Welcome Back
                            </p>
                            <h2 className="text-3xl md:text-4xl font-semibold">
                                Sign In
                            </h2>
                            <p className="subtle-text mt-2">
                                Access your dashboard to track attendance.
                            </p>
                        </div>

                    <TabContext value={value}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <TabList onChange={handleChange}>
                                <Tab label="Student" value="1" />
                                <Tab label="Teacher" value="2" />
                            </TabList>
                        </Box>

                        {/* STUDENT */}
                        <TabPanel value="1">
                            <form className="space-y-4">
                                <input
                                    type="text"
                                    placeholder="Roll Number"
                                    value={roll}
                                    onChange={(e) => setRoll(e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 px-4 py-2 bg-white/80 focus:outline-none focus:ring-2 focus:ring-slate-900/20"
                                />

                                <input
                                    type="password"
                                    placeholder="Password"
                                    value={studentPwd}
                                    onChange={(e) =>
                                        setStudentPwd(e.target.value)
                                    }
                                    className="w-full rounded-xl border border-slate-200 px-4 py-2 bg-white/80 focus:outline-none focus:ring-2 focus:ring-slate-900/20"
                                />

                                <button
                                    className="w-full primary-btn"
                                    onClick={handleStudentLogin}
                                >
                                    <LockIcon /> Sign in
                                </button>

                                <p className="text-center">
                                    Don&apos;t have an account?{' '}
                                    <Link href="/registerStudent">
                                        Register Now
                                    </Link>
                                </p>
                            </form>
                        </TabPanel>

                        {/* TEACHER */}
                        <TabPanel value="2">
                            <form className="space-y-4">
                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 px-4 py-2 bg-white/80 focus:outline-none focus:ring-2 focus:ring-slate-900/20"
                                />

                                <input
                                    type="password"
                                    placeholder="Password"
                                    value={teacherPwd}
                                    onChange={(e) =>
                                        setTeacherPwd(e.target.value)
                                    }
                                    className="w-full rounded-xl border border-slate-200 px-4 py-2 bg-white/80 focus:outline-none focus:ring-2 focus:ring-slate-900/20"
                                />

                                <button
                                    className="w-full primary-btn"
                                    onClick={handleTeacherLogin}
                                >
                                    <LockIcon /> Sign in
                                </button>

                                <p className="text-center">
                                    Don&apos;t have an account?{' '}
                                    <Link href="/registerTeacher">
                                        Register Now
                                    </Link>
                                </p>
                            </form>
                        </TabPanel>
                    </TabContext>
                </div>
            </div>
        </div>
        </ div >
    );
};

export default Login;   
