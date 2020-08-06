let AdminModel = require('./AdminModel');

class AdminController {
    constructor(params) {

    }
    static async create(name, email, password) {
        try {
            return await AdminModel.create({ name, email, password });
        } catch (e) {
            throw e;
        }

    }
    static async login(email, password) {
        let admin = await AdminModel.findOne({ email });
        return await admin.isValidPassword(password);
    }
}

module.exports = AdminController;