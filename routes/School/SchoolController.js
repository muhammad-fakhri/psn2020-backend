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
            throw e;
        }
    }

    static async login(email, password) {
        let school = await SchoolModel.findOne({ email });
        return await school.isValidPassword(password);
    }

    static async list(req, res, next) {
        try {
            let schools = await SchoolModel.find({});
            return res.status(200).json({ message: "success", schools });
        }
        catch (e) {
            return res.status(500).json({ message: e.message, schools: null });
        }
    }

    static async getModel() {
        return SchoolModel;
    }

    static async get(req, res) {
        try {
            let { _id } = req.params,
                school = await SchoolModel.findById({ _id });
            return res.status(200).json({ school });
        } catch (e) {
            return res.status(400).json({ message: e.message });
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
            return res.status(400).json({ message: e.message });
        }
    }
}

module.exports = SchoolController;