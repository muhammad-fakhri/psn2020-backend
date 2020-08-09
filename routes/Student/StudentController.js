const StudentModel = require('./StudentModel');
const SchoolModel = require("../School/SchoolModel");
const TeamModel = require("../Team/TeamModel");

class SchoolController {
    static async create(req, res) {
        try {
            let { name, email, phone, gender } = req.value.body,
                { sub } = req.decoded;
            let student = await StudentModel.create({ name, email, phone, gender, school: sub });
            return res.status(201).json({ student });
        } catch (e) {
            return res.status(500).json({ message: e.message });
        }
    }

    static async listBySchool(req, res) {
        try {
            let { privilege } = req.decoded,
                { schoolId } = req.params;

            if (!schoolId) return res.status(400).json({ message: "Some required data not provided." });

            if (schoolId === "all") {
                if (privilege !== "admin") {
                    return res.status(403).json({ message: "You do not have access to this resource" });
                }
                let students = await StudentModel.find({});
                return res.status(200).json({ students });
            }

            await SchoolModel.exists({ _id: schoolId }, async function (err, result) {
                // if school not exist
                if (!result) return res.status(404).json({ message: "School not found" });

                let students = await StudentModel.find({ school: schoolId });
                return res.status(200).json({ students });
            })
        } catch (e) {
            return res.status(500).json({ message: e.message });
        }
    }

    static async update(req, res) {
        try {
            let { _id, name, email, phone, gender } = req.value.body,
                { sub, privilege } = req.decoded;

            await StudentModel.exists({ _id }, async function (err, result) {
                // if student not exist
                if (!result) return res.status(404).json({ message: 'Student data not found' });

                let student = await StudentModel.findById(_id);

                if (privilege === "school") {
                    if (sub != student.school) {
                        return res.status(403).json({ message: 'You do not have access to this resource' });
                    }
                }

                // check student's team already final or not
                if (student.team) {
                    let team = await TeamModel.findById(student.team);
                    if (team.isFinal) {
                        return res.status(409).json({ message: 'Update student fail, student data with the given ID already final' });
                    }
                }

                // update student data
                student.name = name;
                student.email = email;
                student.phone = phone;
                student.gender = gender;
                student.save();
                return res.status(200).json({ student });
            })
        }
        catch (e) {
            return res.status(500).json({ message: e.message });
        }
    }

    static async delete(req, res) {
        try {
            let { privilege, sub } = req.decoded,
                { studentId } = req.params;

            await StudentModel.exists({ _id: studentId }, async function (err, result) {
                if (!result) return res.status(404).json({ message: "Student data not found" });

                let student = await StudentModel.findById(studentId)

                if (privilege === 'school') {
                    if (sub != student.school) {
                        return res.status(403).json({ message: "You do not have access to this resource" });
                    }
                }

                // check student already final or not
                if (student.team) {
                    let team = await TeamModel.findById(student.team);
                    if (team.isFinal) {
                        return res.status(409).json({ message: 'Delete student fail, student data with the given ID already final' });
                    }
                }

                await student.remove();
                return res.status(200).json({ message: "Student data deleted" });
            })
        } catch (e) {
            return res.status(500).json({ message: e.message });
        }
    }

    static async count(req, res) {
        try {
            let { privilege } = req.decoded,
                { schoolId } = req.params;

            if (!schoolId) return res.status(400).json({ message: "Some required data not provided." });

            if (schoolId === "all") {
                if (privilege !== "admin") {
                    return res.status(403).json({ message: "You do not have access to this resource" });
                }
                let totalStudent = await StudentModel.estimatedDocumentCount();
                return res.status(200).json({ totalStudent });
            }

            await SchoolModel.exists({ _id: schoolId }, async function (err, result) {
                // if school not exist
                if (!result) return res.status(404).json({ message: "School not found" });

                let totalStudent = await StudentModel.countDocuments({ school: schoolId });
                return res.status(200).json({ totalStudent });
            })
        } catch (e) {
            return res.status(500).json({ message: e.message });
        }
    }

    static async getAvailable(req, res) {
        try {
            let { sub, privilege } = req.decoded,
                { schoolId } = req.params;

            await SchoolModel.exists({ _id: schoolId }, async function (err, result) {
                if (!result) return res.status(404).json({ message: "School not found" });

                if (privilege === "school") {
                    if (sub !== schoolId) return res.status(403).json({ message: "You do not have access to this resource" });
                }

                let students = await StudentModel.find({ school: schoolId, team: null });
                return res.status(200).json({ students });
            })
        } catch (e) {
            return res.status(500).json({ message: e.message });
        }
    }
}

module.exports = SchoolController;