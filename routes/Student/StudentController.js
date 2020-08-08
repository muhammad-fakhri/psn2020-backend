let StudentModel = require('./StudentModel');
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
            let { sub, privilege } = req.decoded,
                { school } = req.params,
                students = null;
            if (privilege == "school") {
                students = await StudentModel.find({ school });
                return res.status(200).json({ message: "Success.", students });
            }
            else {
                // someday will be securing this API
                // return res.status(401).json({message:"Not allowed.", students:null});
                if (school == "all")
                    students = await StudentModel.find();
                else
                    students = await StudentModel.find({ school });
                return res.status(200).json({ message: "Success.", students });
            }
        } catch (e) {
            return res.status(400).json({ message: e.message, students: null });
        }
    }

    static async update(req, res) {
        try {
            let { _id, name, email, phone, gender } = req.value.body,
                { sub, privilege } = req.decoded;
            let student = await StudentModel.findById(_id);

            // if student not exist
            if (!student) return res.status(404).json({ message: 'Student data not found' });

            if (privilege === "school") {
                if (sub != student.school) {
                    return res.status(403).json({ message: 'You do not have access to this resource' });
                }
            }

            // check student already final or not
            if (student.team) {
                student.populate('team');
                if (student.team.isFinal) {
                    return res.status(409).json({ message: 'Update student fail, student data with the given ID already final' });
                }
            }

            StudentModel.findByIdAndUpdate(_id, { name, email, phone, gender }, (err, student) => {
                return res.status(200).json({ student });
            });
        }
        catch (e) {
            return res.status(500).json({ message: e.message });
        }
    }

    static async delete(req, res) {
        let { privilege, sub } = req.decoded;
        if (privilege != 'school')
            return res.status(401).json({ message: "Not allowed.", student: null });
        try {
            let { _id } = req.params,
                student = await StudentModel.findById({ _id });
            if (sub == student.school) {
                await student.remove();
                return res.status(200).json({ message: "Success", student });
            } else {
                return res.status(401).json({ message: "Not allowed", student: null });
            }
        } catch (e) {
            return res.status(500).json({ message: "Failed", student: null });
        }
    }

    static async count(req, res) {
        try {
            let { school } = req.params,
                totalStudent = await StudentModel.count({ school });
            return res.status(200).json({ totalStudent });
        } catch (e) {
            return res.status(400).json({ message: e.message, totalStudent: null });
        }
    }

    static async getAvailable(req, res) {
        try {
            let { school } = req.params;
            let students = await StudentModel.find({ school, team: null });
            return res.status(200).json({ students });
        } catch (e) {
            return res.status(400).json({ message: e.message, students: null });
        }
    }

    static async getUnbooked(req, res) {
        try {
            let { school } = req.params,
                students = await StudentModel.find({ accommodationBooking: false, school });
            return res.status(200).json({ students });
        } catch (e) {
            return res.status(400).json({ message: e.message });
        }
    }
}

module.exports = SchoolController;