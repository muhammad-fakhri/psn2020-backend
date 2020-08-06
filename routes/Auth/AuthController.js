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
            let { email, password } = req.value.body;
            SchoolModel.findOne({ email }, async function (err, school) {
                if (!school) {
                    return res.status(404).json({ message: 'Login failed, email not found' });
                }
                if (!school.isVerifiedEmail) {
                    return res.status(401).json({ message: 'Login failed, email is not yet verified' });
                }

                let isMatch = await SchoolController.login(email, password);
                if (isMatch) {
                    let token = JWTController.signTokenToSchool(school);

                    // remove unnecessary information
                    school = school.toObject();
                    delete school.password;
                    delete school.resetPasswordToken;
                    delete school.verifyEmailToken;
                    delete school.changeEmailToken;
                    delete school.verifyEmailDate;
                    delete school.createdAt;
                    delete school.updatedAt;

                    return res.status(200).json({ school, token });
                } else {
                    return res.status(401).json({ message: 'Login failed, password is wrong' });
                }
            });

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

    static async verifyEmail(req, res) {
        try {
            if (!req.query.email || !req.query.token) {
                return res.status(400).json({ message: 'Some required data not provided' });
            }

            SchoolModel.findOne({ email: req.query.email }, function (err, school) {
                // make sure account exist
                if (!school) {
                    return res.status(404).json({ message: 'Verify email failed, email not found' });
                }

                if (school.verifyEmailToken === req.query.token) {
                    school.isVerifiedEmail = true;
                    school.verifyEmailToken = null;
                    school.verifyEmailDate = Date.now();
                    school.save();

                    // login user
                    let token = JWTController.signTokenToSchool(school);

                    // TODO: redirect to front end "Email Verified Page"

                    return res.status(200).json({
                        message: 'Email verified, login success',
                        school,
                        token
                    });
                } else {
                    return res.status(404).json({ message: 'Verify email failed, token is invalid' });
                }
            })
        } catch (e) {
            return res.status(500).json({ message: e.message })
        }
    }

    static async resendVerifyEmail(req, res) {
        try {
            let { email } = req.value.body;
            if (!email) {
                return res.status(400).json({ message: 'Some required data not provided' });
            }

            SchoolModel.findOne({ email }, async function (err, school) {
                // make sure account exist
                if (!school) {
                    return res.status(404).json({ message: 'Resend email verify token failed, email not found' });
                }

                // generate new email verify token
                let verifyEmailToken = crypto.randomBytes(16).toString('hex');
                school.isVerifiedEmail = false;
                school.verifyEmailToken = verifyEmailToken;
                school.save();

                // Resend verification email
                await Mail.sendVerifyEmail(school.name, school.email, verifyEmailToken);

                return res.status(200).json({
                    message: 'Resend email verify token success, please check your email'
                });
            })
        } catch (e) {
            return res.status(500).json({ message: e.message })
        }
    }
}

module.exports = AuthController;