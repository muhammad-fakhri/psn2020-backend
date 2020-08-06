const SchoolController = require('../School/SchoolController');
const SchoolModel = require('../School/SchoolModel');
const JWTController = require('../JWT/JWTController');
const AdminController = require('../Admin/AdminController');
const crypto = require('crypto');
const Mail = require('../Mail');

class AuthController {
    static async schoolRegistration(req, res) {
        try {
            let { name, email, address, phone, password } = req.value.body;

            // Make sure account doesn't already exist
            SchoolModel.findOne({ email }, async function (err, school) {
                // If user already exist
                if (school) return res.status(409).json({ message: 'Register fail, email already exist' });

                // If not exist, create account
                let verifyEmailToken = crypto.randomBytes(16).toString('hex');
                let schoolData = await SchoolController.create(name, email, address, phone, password, verifyEmailToken);

                // Send verification email
                await Mail.sendVerifyEmail(name, email, verifyEmailToken);

                // remove unnecessary information
                schoolData = schoolData.toObject();
                delete schoolData.password;
                delete schoolData.resetPasswordToken;
                delete schoolData.verifyEmailToken;
                delete schoolData.changeEmailToken;
                delete schoolData.verifyEmailDate;
                delete schoolData.createdAt;
                delete schoolData.updatedAt;

                return res.status(201).json({ school: schoolData });
            })
        }
        catch (e) {
            return res.status(500).json({ message: e.message });
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