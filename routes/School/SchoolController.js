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
            let schools = await SchoolModel.find({}, '_id name email address phone isVerifiedEmail');
            return res.status(200).json({ schools });
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
                school = await SchoolModel.findById(schoolId, '_id name email address phone isVerifiedEmail');
            if (!school) return res.status(404).json({ message: 'School not found' });
            return res.status(200).json({ school });
        } catch (e) {
            return res.status(500).json({ message: e.message });
        }
    }

    static async getSchoolDetail(req, res) {
        try {
            let { sub } = req.decoded;
            let school = await SchoolModel.findById(sub, '_id name email address phone isVerifiedEmail');
            return res.status(200).json({ school });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    static async updateSchoolDetail(req, res) {
        try {
            let { sub } = req.decoded;
            let { name, email, address, phone } = req.value.body;
            let school = await SchoolModel.findById(sub, '_id name email address phone isVerifiedEmail');

            school.name = name;
            school.email = email;
            school.address = address;
            school.phone = phone;
            school.save();
            return res.status(200).json({ school });
        } catch (error) {
            return res.status(200).json({ message: error.message });
        }
    }

    static async search(req, res) {
        try {
            let { searchString, skip, limit } = req.query;
            if (!searchString) return res.status(400).json({ message: 'Some required data not provided' });
            let schools = await SchoolModel.find({
                name: {
                    $regex: new RegExp(searchString, "ig")
                }
            }, '_id name email address phone isVerifiedEmail')
                .sort({ name: 'asc' })
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