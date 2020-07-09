let SchoolModel = require('./SchoolModel');
class SchoolController {
    static async create(name, address, email, phone, username, password) {
        try {
            return await SchoolModel.create({ name, address, email, phone, username, password });
        } catch (e) {
            throw e;
        }
    }
    static async login(username, password) {
        let school = await SchoolModel.findOne({ username });
        if (school == null)
            return { status: 404, school: null, message: "Username not found." }
        let isMatch = await school.isValidPassword(password);
        if (isMatch) {
            return { status: 200, school, message: "Success" }
        }
        else {
            return { status: 400, school: null, message: "Wrong password." }
        }
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