require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Student = require('../models/Student');
const Subject = require('../models/Subject');
const Attendance = require('../models/Attendance');

const secretKey = process.env.SECRET_KEY;

module.exports.registerStudent = async(req, res) => {
    const { name, roll, course } = req.body;
    try {
        const exists = await Student.findOne({ roll });
        if (exists) {
            return res.status(409).json({ msg: "Student already exists" });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPwd = await bcrypt.hash(req.body.password, salt);
        const student = await Student.create({
            ...req.body,
            roll,
            course,
            name,
            password: hashedPwd
        });
        const token = jwt.sign(
            {
                id: student._id.toString(),
                roll: student.roll,
                name: student.name,
                course: student.course,
                year: student.year,
                semester: student.semester,
                branch: student.branch
            },
            secretKey
        );
        return res.status(200).json({
            msg: "Student registered successfully",
            res: token
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "DB error" });
    }
};


module.exports.loginStudent = async(req, res) => {
    const { roll, password } = req.body;
    try {
        const student = await Student.findOne({ roll });
        if (!student) {
            return res.status(404).json({ msg: "Student not found" });
        }
        const pwdCheck = await bcrypt.compare(password, student.password);
        if (!pwdCheck) {
            return res.status(203).json({ msg: "Invalid Credentials" });
        }
        const token = jwt.sign(
            {
                id: student._id.toString(),
                roll: student.roll,
                name: student.name,
                course: student.course,
                year: student.year,
                semester: student.semester,
                branch: student.branch
            },
            secretKey
        );
        return res.status(200).json({
            msg: "Login successful",
            data: token
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "DB error" });
    }
};


module.exports.getSubjects = async(req, res) => {
    console.log("Inside Controller")
    const { branch, semester, course, year } = req.body;
    // console.log("req body : ", req.body);
    const normalize = (value) => (value ?? '').toString().trim();
    const escapeRegex = (value) => normalize(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const ci = (value) => new RegExp(`^${escapeRegex(value)}$`, 'i');
    try {
        const query = {};
        if (normalize(branch)) query.branch = ci(branch);
        if (normalize(course)) query.course = ci(course);
        if (normalize(semester)) query.semester = normalize(semester);
        if (normalize(year)) query.year = normalize(year);

        const subjects = await Subject.find(query);
        if (subjects.length > 0) {
            return res.status(200).json({ "data": subjects.map((s) => s.toJSON()) })
        }
        return res.status(203).json({ "res": subjects, "msg": "No Subjects Found!" });
    } catch (error) {
        console.log("Database Error: ", error);
        return res.status(500).json({ "msg": "Database connection error" });
    }
}

module.exports.getattendance = async(req, res) => {
    const { roll, subject } = req.body;
    try {
        const query = { roll };
        if (subject) {
            query.subject = subject;
        }
        const attendance = await Attendance.find(query).sort({ date: -1 });
        if (!attendance.length) {
            return res.status(203).json({ msg: "No attendance records found" });
        }
        return res.status(200).json({ data: attendance.map((a) => a.toJSON()) });
    } catch (error) {
        console.log("Database Error:", error);
        return res.status(500).json({ msg: "Database error" });
    }
};
