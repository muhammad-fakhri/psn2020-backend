let SchoolController = require('../School/SchoolController'),
    JWTController = require('../JWT/JWTController'),
    AdminController = require('../Admin/AdminController');

class AuthController {
    static async schoolRegistration(req, res) {
        try {
            let { name, address, email, phone, username, password } = req.value.body,
                school = await SchoolController.create(name, address, email, phone, username, password),
                token = JWTController.signTokenToSchool(school);
            return res.status(201).json({ message: "Success", school, token });
        }
        catch (e) {
            return res.status(500).json({ message: e.message, school: null, token: null });
        }
    }
    static async schoolLogin(req, res) {
        try {
            let { username, password } = req.value.body,
                data = await SchoolController.login(username, password),
                token = JWTController.signTokenToSchool(data.school);
            return res.status(data.status).json({ message: data.message, school: data.school, token });
        }
        catch (e) {
            return res.status(500).json({ message: e.message, school: null, token: null })
        }
    }
    static async adminRegistration(req, res) {
        try {
            let { name, username, email, password } = req.value.body,
                admin = await AdminController.create(name, username, email, password),
                token = JWTController.signTokenToAdmin(admin);
            return res.status(200).json({ message: "Success", admin, token });
        } catch (e) {
            return res.status(500).json({ message: e.message, admin: null, token: null });
        }
    }
    static async adminLogin(req, res) {
        try {
            let { username, password } = req.value.body,
                data = await AdminController.login(username, password),
                token = JWTController.signTokenToAdmin(data.admin);
            return res.status(data.status).json({ message: data.message, admin: data.admin, token });
        }
        catch (e) {
            return res.status(500).json({ message: e.message, admin: null, token: null })
        }
    }
}

module.exports = AuthController;