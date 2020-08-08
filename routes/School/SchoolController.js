const SchoolModel = require('./SchoolModel');
const bcrypt = require('bcryptjs');

class SchoolController {
    static async create(name, email, address, phone, password, verifyEmailToken) {
        try {
            // Make hashed password
            const salt = await bcrypt.genSalt(10);
            let passwordHash = await bcrypt.hash(password, salt);

            return await SchoolModel.create({
                name,
                email,
                address,
                phone,
                password: passwordHash,
                verifyEmailToken
            });
        } catch (e) {
            return res.status(500).json({ message: e.message });
        }
    }

    static async login(email, password) {
        try {
            let school = await SchoolModel.findOne({ email });
            return await school.isValidPassword(password);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    static async listAllSchools(req, res, next) {
        try {
            let schools = await SchoolModel.find({});

            // delete unnecessary information
            let filteredSchoolsData = new Array();
            schools.forEach(school => {
                school = school.toObject();
                delete school.password;
                delete school.resetPasswordToken;
                delete school.verifyEmailToken;
                delete school.changeEmailToken;
                delete school.verifyEmailDate;
                delete school.createdAt;
                delete school.updatedAt;
                filteredSchoolsData.push(school);
            })

            return res.status(200).json({ schools: filteredSchoolsData });
        }
        catch (e) {
            return res.status(500).json({ message: e.message });
        }
    }

    static async getModel() {
        return SchoolModel;
    }

    static async getSchoolDetailById(req, res) {
        try {
            let { schoolId } = req.params,
                school = await SchoolModel.findById(schoolId);
            if (!school) return res.status(404).json({ message: 'School not found' });

            // delete unnecessary information
            school = school.toObject();
            delete school.password;
            delete school.resetPasswordToken;
            delete school.verifyEmailToken;
            delete school.changeEmailToken;
            delete school.verifyEmailDate;
            delete school.createdAt;
            delete school.updatedAt;
            return res.status(200).json({ school });
        } catch (e) {
            return res.status(500).json({ message: e.message });
        }
    }

    static async getSchoolDetail(req, res) {
        try {
            let { sub } = req.decoded;
            let school = await SchoolModel.findById(sub);

            // delete unnecessary information
            school = school.toObject();
            delete school.password;
            delete school.resetPasswordToken;
            delete school.verifyEmailToken;
            delete school.changeEmailToken;
            delete school.verifyEmailDate;
            delete school.createdAt;
            delete school.updatedAt;

            return res.status(200).json({ school });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    static async updateSchoolDetail(req, res) {
        try {
            let { sub } = req.decoded;
            let { name, email, address, phone } = req.value.body;
            let school = await SchoolModel.findById(sub);

            school.name = name;
            school.email = email;
            school.address = address;
            school.phone = phone;
            school.save();

            // delete unnecessary information
            school = school.toObject();
            delete school.password;
            delete school.resetPasswordToken;
            delete school.verifyEmailToken;
            delete school.changeEmailToken;
            delete school.verifyEmailDate;
            delete school.createdAt;
            delete school.updatedAt;

            return res.status(200).json({ school });
        } catch (error) {
            return res.status(200).json({ message: error.message });
        }
    }

    static async search(req, res) {
        try {
            let { searchString, skip, limit } = req.query;
            console.log(searchString);
            let schools = await SchoolModel.find(
                { $text: { $search: searchString } },
                { score: { "$meta": "textScore" } })
                .sort({ score: { "$meta": "textScore" } })
                .skip(parseInt(skip) || 0)
                .limit(parseInt(limit) || 10);
            return res.status(200).json({ schools });
        } catch (e) {
            return res.status(500).json({ message: e.message });
        }
    }

    static async count(req, res) {
        try {
            let count = await SchoolModel.estimatedDocumentCount();
            return res.status(200).json({ totalSchool: count });
        } catch (e) {
            return res.status(500).json({ message: e.message });
        }
    }
}

module.exports = SchoolController;