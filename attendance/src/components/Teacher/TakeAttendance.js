import React, { useState, useEffect, useCallback } from 'react'
import Header from '../header/Header'
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { path } from '../../path'
import jwt_decode from "jwt-decode";

const axios = require('axios')
const TakeAttendance = () => {

    const [course, setcourse] = useState("");
    const [year, setyear] = useState("");
    const [subjects, setsubjects] = useState([]);
    const [students, setstudents] = useState([]);
    const [subject, setsubject] = useState("");
    const [showRecord, setshowRecord] = useState(false);
    const [teacher, setTeacher] = useState(null);
    const [attendance, setAttendance] = useState([]);
    const [counts, setCounts] = useState({ present: 0, absent: 0, leave: 0 });
    const [attendanceDate, setAttendanceDate] = useState(() => {
        const now = new Date();
        return now.toISOString().slice(0, 10);
    });

    const token = localStorage.getItem('token');
    const navigate = useNavigate();
    const getTeacherFromToken = useCallback(() => {
        if (!token) return;
        const decoded = jwt_decode(token);
        setTeacher(decoded);
    }, [token]);

    useEffect(() => {
        getTeacherFromToken();
    }, [getTeacherFromToken]);

    const btechyear = [['1', '1st Year'], ['2', '2nd Year'], ['3', '3rd Year'], ['4', '4th Year']];
    const mtechyear = [['1', '1st Year'], ['2', '2nd Year']];
    const handleCourseChange = (e) => {
        setcourse(e.target.value)
    }
    const getSubjListByYear = useCallback(() => {
        if (course.length && year.length && teacher?.id) {

            axios.post(`${path}/getSubjByYear`, {
                course: course,
                year: year,
                teacher_id: teacher.id
            })
                .then(function (response) {
                    console.log("Res: ", response);
                    if (response.status === 203) {
                        // toast.error(response.data.msg);
                        setsubjects([])
                    }
                    else {
                        console.log("resp: ", response);
                        setsubjects(response.data.data)
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
        else {
            console.log("please fill")
            // toast.warn("Please fill all the details carefully!!")
        }
    }, [course, year, teacher?.id]);
    const getStudentsBySubject = useCallback(() => {
        var sub = subjects.find((s) => {
            return s.code === subject;
        })
        if (sub) {
            axios.post(`${path}/getStudentsBySubject`, sub)
                .then(function (response) {
                    console.log("Res: ", response);
                    if (response.status === 203) {
                        // toast.error(response.data.msg);
                        setsubjects([])
                    }
                    else {
                        console.log("resp: ", response);
                        const data = response.data.data;
                        setstudents(data);
                        setAttendance(data.map((s) => ({ roll: s.roll, status: "absent" })));
                        setshowRecord(false);
                        setCounts({ present: 0, absent: 0, leave: 0 });
                        // console.log("attendance arr: ",attendance)
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
        else {
            console.log("please fill")
            // toast.warn("Please fill all the details carefully!!")
        }
    }, [subject, subjects]);
    // console.log("Date: ",(new Date()).toISOString().split('T')[0])
    const handleAttendanceSubmit = async () => {
        var sub = subjects.find((s) => {
            return s.code === subject;
        })
        if (attendance.length && sub) {
            axios.post(`${path}/takeAttendance`, {
                "subject": sub.code,
                "year": sub.year,
                "semester": sub.semester,
                "attendance": attendance,
                "date": attendanceDate
            })
                .then(function (response) {
                    console.log("Res: ", response);
                    if (response.status === 203) {
                        toast.error(response.data.msg);
                    }
                    else {
                        console.log("resp: ", response);
                        toast.success(response.data.msg);
                        // console.log("attendance arr: ",attendance)

                        let present = 0;
                        let absent = 0;
                        let leave = 0;
                        for (let i = 0; i < attendance.length; i++) {
                            if (attendance[i].status === 'present') {
                                present += 1;
                            }
                            else if (attendance[i].status === 'absent') {
                                absent += 1;
                            } else {
                                leave += 1;
                            }
                        }
                        setCounts({ present, absent, leave });
                        setshowRecord(true);
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
        else {
            console.log("please fill")
            // toast.warn("Please fill all the details carefully!!")
        }
    }
    useEffect(() => {
        getSubjListByYear();
    }, [getSubjListByYear]);

    useEffect(() => {
        getStudentsBySubject();
    }, [getStudentsBySubject]);
    useEffect(() => {
        if (localStorage.getItem('token') === null || localStorage.getItem('type') !== 'teacher') {
            navigate('/');
        }
    }, [navigate]);
    const selectOnlyThis = (e, roll) => {
        var myCheckbox = document.getElementsByName(roll);
        Array.prototype.forEach.call(myCheckbox, function (el) {
            el.checked = false;
        });
        e.target.checked = true;
        // console.log("roll :",roll)
        // console.log(" bef Attendance : ",attendance);
        setAttendance((prev) => {
            const next = [...prev];
            const i = next.findIndex((e) => e.roll === roll);
            if (i >= 0) {
                next[i] = { ...next[i], status: e.target.value };
            }
            return next;
        });
    }
    return (
        <div>
            <ToastContainer position="top-right"
                autoClose={2000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover />
            <Header />
            <div className="container mx-auto">
                <div className="flex  justify-center px-6">
                    <div className="w-[80%] ">
                        <div className=" glass-panel p-6">
                            <h3 className="pt-2 text-2xl text-center font-semibold">Select Subject </h3>
                            <form className="px-6 pt-6 pb-4">

                                <div className="mb-4 md:flex md:justify-between">
                                    <div className="mb-4 md:mr-2 md:mb-0 w-1/2">
                                        <label className="block mb-2 text-sm font-bold text-gray-700 flex justify-start" htmlFor="course">
                                            Course
                                        </label>
                                        <select name="" className='w-full px-4 py-2 text-sm leading-tight text-gray-700 border rounded-xl shadow-sm appearance-none focus:outline-none focus:ring-2 focus:ring-slate-900/20' id="course" value={course} onChange={handleCourseChange} required>
                                            <option >Select Course</option>
                                            <option value="btech">B-tech </option>
                                            <option value="mtech">M-tech</option>
                                        </select>
                                    </div>


                                    <div className="mb-4 md:mr-2 md:mb-0 w-1/2">
                                        <label className="block mb-2 text-sm font-bold text-gray-700 flex justify-start" htmlFor="year">
                                            Year
                                        </label>
                                        <select required
                                            id="year"
                                            name='year'
                                            value={year}
                                            onChange={(e) => {
                                                setyear(e.target.value);
                                            }}
                                            className='w-full px-4 py-2 text-sm leading-tight text-gray-700 border rounded-xl shadow-sm appearance-none focus:outline-none focus:ring-2 focus:ring-slate-900/20'>
                                            <option >Select Year</option>
                                            {
                                                course === "btech" && btechyear.map((y) => {
                                                    return <option key={`btech-${y[0]}`} value={y[0]}>{y[1]}</option>
                                                })
                                            }
                                            {
                                                course === "mtech" && mtechyear.map((y) => {
                                                    return <option key={`mtech-${y[0]}`} value={y[0]}>{y[1]}</option>
                                                })
                                            }

                                        </select>
                                    </div>
                                    <div className="mb-4 md:mr-2 md:mb-0 w-1/2">
                                        <label className="block mb-2 text-sm font-bold text-gray-700 flex justify-start" htmlFor="subject">
                                            Choose Subject
                                        </label>
                                        <select required
                                            id="subject"
                                            name='subject'
                                            value={subject}
                                            onChange={(e) => {
                                                setsubject(e.target.value);
                                            }}
                                            className='w-full px-4 py-2 text-sm leading-tight text-gray-700 border rounded-xl shadow-sm appearance-none focus:outline-none focus:ring-2 focus:ring-slate-900/20'>
                                            <option >Select Subject</option>
                                            {
                                                subjects.map((s) => {
                                                    return <option key={s.id || s.code} value={s.code} >{s.name}</option>
                                                })
                                            }
                                        </select>
                                    </div>
                                </div>
                                <div className="mb-4 md:flex md:justify-between">
                                    <div className="mb-4 md:mr-2 md:mb-0 w-1/2">
                                        <label className="block mb-2 text-sm font-bold text-gray-700 flex justify-start" htmlFor="attendanceDate">
                                            Attendance Date
                                        </label>
                                        <input
                                            id="attendanceDate"
                                            type="date"
                                            value={attendanceDate}
                                            onChange={(e) => setAttendanceDate(e.target.value)}
                                            className="w-full px-4 py-2 text-sm leading-tight text-gray-700 border rounded-xl shadow-sm appearance-none focus:outline-none focus:ring-2 focus:ring-slate-900/20"
                                            required
                                        />
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            {
                students.length > 0 && <div className="container mx-auto xl:w-[80%]">
                    <div className="flex  justify-center px-6 ">
                        <div className="md:w-[100%] ">
                            <div className=" glass-panel p-6">
                                <h3 className="pt-2 text-2xl text-center font-semibold">Attendance List </h3>
                                <form className="px-6 pt-6 pb-4">
                                    {
                                        students.map((st) => {
                                            return <div key={st.id || st.roll}>
                                                <div className="mb-4 md:mr-2 md:mb-2  flex flex-row items-center">
                                                <h2>{st.roll}</h2>
                                                <h2 className='w-1/2 ml-2 text-left'>{st.name}</h2>
                                                <div className="flex justify-between w-1/2">
                                                    <div className="form-check form-check-inline flex flex-row justify-between">
                                                        <h3>Present &nbsp; </h3>
                                                        <input type="checkbox" name={st.roll} value="present" onClick={(e) => {
                                                            selectOnlyThis(e, st.roll)
                                                        }
                                                        }
                                                        />
                                                    </div>
                                                    <div className="form-check form-check-inline flex flex-row">
                                                        <h3>Absent &nbsp;  </h3>
                                                        <input type="checkbox" name={st.roll} value="absent" onClick={(e) => {
                                                            selectOnlyThis(e, st.roll)
                                                        }
                                                        } />
                                                    </div>
                                                    <div className="form-check form-check-inline flex flex-row">
                                                        <h3>Leave &nbsp;  </h3>
                                                        <input type="checkbox" name={st.roll} value="leave" onClick={(e) => {
                                                            selectOnlyThis(e, st.roll)
                                                        }
                                                        } />
                                                    </div>
                                                </div>
                                            </div>
                                                <hr />
                                            </div>
                                        })
                                    }


                                    <div className="mb-6 text-center">
                                        <button onClick={handleAttendanceSubmit}
                                            className="primary-btn"
                                            type="button" >
                                            Take Attendance
                                        </button>
                                    </div>
                                    {

                                        showRecord && <div className="mb-6 text-center">
                                            <h2>Attendance recorded succesfully!</h2>
                                            <h2>Present: {counts.present} Absent : {counts.absent}  Leave : {counts.leave}</h2>
                                        </div>
                                    }
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}

export default TakeAttendance
