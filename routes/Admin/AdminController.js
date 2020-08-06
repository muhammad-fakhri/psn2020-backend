let AdminModel = require('./AdminModel');

class AdminController {
    constructor(params) {

    }
    static async create(name, username, email, password) {
        try {
            return await AdminModel.create({ name, username, email, password });
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