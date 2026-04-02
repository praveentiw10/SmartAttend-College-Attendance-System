require('dotenv').config();
const jwt = require('jsonwebtoken');
const Subject = require('../models/Subject');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');

const USERNAME = "admin";
const PWD = "admin";
const secretKey = process.env.SECRET_KEY;

module.exports.loginAdmin = async(req, res) => {
    console.log("Inside Controller")
    const { username, password } = req.body;
    console.log("req body : ", req.body);
    if (username == USERNAME && password == PWD) {
        // const resData = JSON.stringify(response[0]);
        var token = jwt.sign(req.body, secretKey);
        return res.status(200).json({ "msg": "Logged in succesfully!!.", "data": token })
    } else {
        return res.status(203).json({ "msg": "Invalid Credentials" })
    }
}

module.exports.addSubject = async(req, res) => {
    console.log("Inside Controller")
    const { code } = req.body;
    console.log("req body : ", req.body);
    try {
        const exists = await Subject.findOne({ code });
        if (exists) {
            return res.status(203).json({ "msg": "Subject is already Added." })
        }
        await Subject.create(req.body);
        return res.status(200).json({ "msg": "Added succesfully!!" });
    } catch (error) {
        console.log("Insert Error: ", error);
        return res.status(500).json({ "msg": "Database error" });
    }
}
module.exports.updateSubject = async(req, res) => {
    // console.log("Inside Controller")
    const updatedSubj = req.body;
    // console.log("req body : ", updatedSubj);
    try {
        const updated = await Subject.findByIdAndUpdate(
            updatedSubj.id,
            {
                code: updatedSubj.code,
                name: updatedSubj.name,
                course: updatedSubj.course,
                branch: updatedSubj.branch,
                semester: updatedSubj.semester,
                year: updatedSubj.year,
                teacher_id: updatedSubj.teacher_id
            },
            { new: true }
        );
        if (updated) {
            return res.status(200).json({ "msg": "Subject updated succesfully!" })
        }
        return res.status(203).json({ "msg": "Oops!! Try again!" });
    } catch (error) {
        console.log("Update Error: ", error);
        return res.status(500).json({ "msg": "Database error" });
    }
}
module.exports.deleteSubject = async(req, res) => {
    console.log("Inside Controller", req.body)
    try {
        const deleted = await Subject.findByIdAndDelete(req.body.id);
        if (deleted) {
            return res.status(200).json({ "msg": "Subject deleted succesfully!" })
        }
        return res.status(203).json({ "msg": "Oops!! Try again!" });
    } catch (error) {
        console.log("Delete Error: ", error);
        return res.status(500).json({ "msg": "Database error" });
    }
}
module.exports.getAllSubj = async(req, res) => {
    console.log("Inside Controller")
        // const { code } = req.body;
    console.log("req body : ", req.body);
    try {
        const subjects = await Subject.find({}).sort({ createdAt: -1 });
        if (subjects.length > 0) {
            return res.status(200).json({ "data": subjects.map((s) => s.toJSON()) })
        }
        return res.status(203).json({ "res": subjects, "msg": "No Subjects Found!" });
    } catch (error) {
        console.log("Fetch Error: ", error);
        return res.status(500).json({ "msg": "Database error" });
    }
}
module.exports.getStudentsByCourseAndyear = async(req, res) => {
    console.log("Inside Controller")
    const { course, year, branch } = req.body;
    console.log("req body : ", req.body);
    try {
        const students = await Student.find({ course, year, branch }).select('-password').sort({ roll: 1 });
        if (students.length > 0) {
            return res.status(200).json({ "data": students.map((s) => s.toJSON()) })
        }
        return res.status(203).json({ "res": students, "msg": "No students Found!" });
    } catch (error) {
        console.log("Fetch Error: ", error);
        return res.status(500).json({ "msg": "Database error" });
    }
}

module.exports.getAllTeachers = async(req, res) => {
    // console.log("Inside Controller")
    // const { course , year , branch } = req.body;
    // console.log("req body : ", req.body);
    try {
        const teachers = await Teacher.find({}).select('-password').sort({ createdAt: -1 });
        if (teachers.length > 0) {
            return res.status(200).json({ "data": teachers.map((t) => t.toJSON()) })
        }
        return res.status(203).json({ "res": teachers, "msg": "No proffesors Found!" });
    } catch (error) {
        console.log("Fetch Error: ", error);
        return res.status(500).json({ "msg": "Database error" });
    }
}

module.exports.getSubjByCourseAndyear = async(req, res) => {
    console.log("Inside Controller")
    const { course, year } = req.body;
    console.log("req body : ", req.body);
    try {
        const subjects = await Subject.find({ course, year }).sort({ createdAt: -1 });
        if (subjects.length > 0) {
            return res.status(200).json({ "data": subjects.map((s) => s.toJSON()) })
        }
        return res.status(203).json({ "res": subjects, "msg": "No Subjects Found!" });
    } catch (error) {
        console.log("Fetch Error: ", error);
        return res.status(500).json({ "msg": "Database error" });
    }
}
