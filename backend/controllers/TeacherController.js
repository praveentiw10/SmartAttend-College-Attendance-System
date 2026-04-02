const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const Teacher = require('../models/Teacher');
const Subject = require('../models/Subject');
const Student = require('../models/Student');
const Attendance = require('../models/Attendance');

const secretKey = process.env.SECRET_KEY;

module.exports.registerTeacher = async(req, res) => {
    console.log("Inside Controller")
    const { name, email, contact, branch, password } = req.body;
    console.log("req body : ", req.body);
    try {
        const exists = await Teacher.findOne({ email });
        if (exists) {
            return res.status(203).json({ "msg": "User is already registered." })
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPwd = await bcrypt.hash(password, salt);
        const teacher = await Teacher.create({
            name,
            email,
            contact,
            branch,
            password: hashedPwd
        });
        const token = jwt.sign(
            { id: teacher._id.toString(), name: teacher.name, email: teacher.email, branch: teacher.branch },
            secretKey
        );
        return res.status(200).json({ "res": token, "msg": "Registered Succesfully!!" });
    } catch (error) {
        console.log("Insert Error: ", error);
        return res.status(500).json({ "msg": "Database error" });
    }
}
module.exports.loginTeacher = async(req, res) => {
    console.log("Inside Controller")
    const { email, password } = req.body;
    console.log("req body : ", req.body);
    try {
        const teacher = await Teacher.findOne({ email });
        if (!teacher) {
            return res.status(203).json({ "msg": "User not registered!!" });
        }
        const pwdCheck = await bcrypt.compare(password, teacher.password);
        if (!pwdCheck) {
            return res.status(203).json({ "msg": "Invalid Credentials" })
        }
        const token = jwt.sign(
            { id: teacher._id.toString(), name: teacher.name, email: teacher.email, branch: teacher.branch },
            secretKey
        );
        return res.status(200).json({ "msg": "Logged in succesfully!!.", "data": token })
    } catch (error) {
        console.log("Login Error: ", error);
        return res.status(500).json({ "msg": "Database error" });
    }
}

module.exports.getSubjByCourse = async(req, res) => {
    console.log("Inside Controller")
    const { teacher_id, course, year } = req.body;
    console.log("req body : ", req.body);
    try {
        let subjects = [];
        if (teacher_id) {
            subjects = await Subject.find({ teacher_id, course, year }).sort({ createdAt: -1 });
        }
        if (subjects.length === 0) {
            subjects = await Subject.find({ course, year }).sort({ createdAt: -1 });
        }
        if (subjects.length > 0) {
            return res.status(200).json({ "data": subjects.map((s) => s.toJSON()) })
        }
        return res.status(203).json({ "res": subjects, "msg": "No Subjects Found!" });
    } catch (error) {
        console.log("Fetch Error: ", error);
        return res.status(500).json({ "msg": "Database error" });
    }
}


module.exports.getStudentsBySubject = async(req, res) => {
    console.log("Inside Controller")
    const { course, year, semester, branch } = req.body;
    console.log("req body : ", req.body);
    const normalize = (value) => (value ?? '').toString().trim();
    const escapeRegex = (value) => normalize(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const ci = (value) => new RegExp(`^${escapeRegex(value)}$`, 'i');
    try {
        const query = {};
        if (normalize(course)) query.course = ci(course);
        if (normalize(branch)) query.branch = ci(branch);
        if (normalize(semester)) query.semester = normalize(semester);
        if (normalize(year)) query.year = normalize(year);
        const students = await Student.find(query)
            .select('-password')
            .sort({ roll: 1 });
        if (students.length > 0) {
            return res.status(200).json({ "data": students.map((s) => s.toJSON()) })
        }
        return res.status(203).json({ "res": students, "msg": "No Students  Found!" });
    } catch (error) {
        console.log("Fetch Error: ", error);
        return res.status(500).json({ "msg": "Database error" });
    }
}
module.exports.takeAttendance = async(req, res) => {
    console.log("Inside take attendance Controller")
    const { subject, year, semester, attendance, date } = req.body;
    console.log("req body : ", req.body);
    try {
        const now = date ? new Date(date) : new Date();
        const yyyy = now.getFullYear().toString();
        const mm = String(now.getMonth() + 1).padStart(2, '0');
        const dd = String(now.getDate()).padStart(2, '0');
        const dateKey = `${yyyy}-${mm}-${dd}`;
        const dateValue = new Date(`${dateKey}T00:00:00.000Z`);

        const alreadyRecorded = await Attendance.exists({
            subject,
            year,
            semester,
            dateKey
        });
        if (alreadyRecorded) {
            return res.status(203).json({ "msg": "Attendance already Recorded!" });
        }

        const docs = attendance.map((a) => ({
            roll: a.roll,
            year,
            semester,
            subject,
            status: a.status,
            date: dateValue,
            dateKey
        }));
        await Attendance.insertMany(docs);
        return res.status(200).json({ "msg": "Attendance Recorded Succesfully!!" })
    } catch (error) {
        console.log("Insert Error: ", error);
        return res.status(500).json({ "msg": "Database error" });
    }
}

module.exports.getAttendanceBySubject = async(req, res) => {
    console.log("Inside Controller")
    const { course, year, subject } = req.body;
    // console.log("req body : ", req.body);
    try {
        const students = await Student.find({ course, year })
            .select('-password')
            .sort({ roll: 1 });
        if (!students.length) {
            return res.status(203).json({ "res": students, "msg": "No records  Found!" });
        }
        const resData = await Promise.all(
            students.map(async(st) => {
                const records = await Attendance.find({
                    roll: st.roll,
                    subject,
                    year
                }).sort({ date: -1 });
                return {
                    roll: st.roll,
                    name: st.name,
                    attendance: records.map((r) => r.toJSON())
                };
            })
        );
        const hasAnyAttendance = resData.some((st) => st.attendance.length > 0);
        if (!hasAnyAttendance) {
            return res.status(203).json({ "msg": "No records  Found!" });
        }
        return res.status(200).json({ "data": resData })
    } catch (error) {
        console.log("Fetch Error: ", error);
        return res.status(500).json({ "msg": "Database error" });
    }
}

module.exports.updateAttendance = async(req, res) => {
    console.log("Inside Controller")
    const { id, status } = req.body;
    console.log("req body : ", req.body);
    try {
        const updated = await Attendance.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );
        if (updated) {
            return res.status(200).json({ "data": updated.toJSON(), "msg": "Updated!" })
        }
        return res.status(203).json({ "msg": "Oops !! Cannot Update" });
    } catch (error) {
        console.log("Update Error: ", error);
        return res.status(500).json({ "msg": "Database error" });
    }
}
