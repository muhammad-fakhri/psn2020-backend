const SchoolController = require('../School/SchoolController');
const SchoolModel = require('../School/SchoolModel');
const AdminModel = require('../Admin/AdminModel');
const JWTController = require('../JWT/JWTController');
const AdminController = require('../Admin/AdminController');
const SchoolNameModel = require('../Data/SchoolNameModel');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const Mail = require('../Mail');

class AuthController {
    static async schoolRegistration(req, res) {
        try {
            let { name, email, address, phone, province, password } = req.value.body;

            // Make sure account doesn't already exist
            SchoolModel.findOne({ email }, async function (err, school) {
                // If user already exist
                if (school) return res.status(409).json({ message: 'Register fail, email already exist' });

                // If not exist, create account
                let verifyEmailToken = crypto.randomBytes(16).toString('hex');
                let schoolData = await SchoolController.create(name, email, address, phone, province, password, verifyEmailToken);

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

                // check school name already exist or not
                let schoolName = await SchoolNameModel.findOne({ name: schoolData.name });
                if (!schoolName) {
                    await SchoolNameModel.create({ name: schoolData.name });
                }

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
            SchoolModel.findOne({ email }, '_id name email address phone province isVerifiedEmail', async function (err, school) {
                if (!school) {
                    return res.status(404).json({ message: 'Login failed, email not found' });
                }
                if (!school.isVerifiedEmail) {
                    return res.status(401).json({ message: 'Login failed, email is not yet verified' });
                }

                let isMatch = await SchoolController.login(email, password);
                if (isMatch) {
                    let token = JWTController.signTokenToSchool(school);
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

    static async adminLogin(req, res) {
        try {
            let { email, password } = req.value.body;

            AdminModel.findOne({ email }, '_id name email isSuperAdmin', async function (err, admin) {
                if (!admin) {
                    return res.status(404).json({ message: 'Login failed, email not found' });
                }

                let isMatch = await AdminController.login(email, password);
                if (isMatch) {
                    let token = JWTController.signTokenToAdmin(admin);
                    return res.status(200).json({ admin, token });
                } else {
                    return res.status(401).json({ message: 'Login failed, password is wrong' });
                }
            });
        }
        catch (e) {
            return res.status(500).json({ message: e.message })
        }
    }

    static async verifyEmail(req, res) {
        try {
            if (!req.query.email || !req.query.token) {
                return res.status(400).json({ message: 'Some required data not provided' });
            }

            SchoolModel.findOne({ email: req.query.email },
                '_id name email address phone province isVerifiedEmail verifyEmailToken verifyEmailDate',
                function (err, school) {
                    // make sure account exist
                    if (!school) {
                        return res.status(404).json({ message: 'Verify email failed, email not found' });
                    }

                    if (school.verifyEmailToken === req.query.token) {
                        school.isVerifiedEmail = true;
                        school.verifyEmailToken = null;
                        school.verifyEmailDate = Date.now();
                        school.save();

                        // redirect to front end "Email Verified Page"
                        return res.redirect(process.env.FRONT_END_URL + `/email/verified?name=${school.name}&email=${school.email}&message='Email verified'`)
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

    static async changePassword(req, res) {
        let { oldPassword, newPassword } = req.value.body;
        let { sub } = req.decoded;
        let school = await SchoolModel.findById(sub);

        // check old password
        let isMatch = await school.isValidPassword(oldPassword);
        if (!isMatch) {
            return res.status(403).json({
                message: 'Change password fail, your old password is wrong'
            });
        }

        // save new password
        const salt = await bcrypt.genSalt(10);
        let passwordHash = await bcrypt.hash(newPassword, salt);
        school.password = passwordHash;
        school.save();

        return res.status(200).json({ message: 'Change password success' });
    }

    static async forgotPassword(req, res) {
        let { email } = req.value.body;
        SchoolModel.findOne({ email }, async function (err, school) {
            if (!school) {
                return res.status(404)
                    .json({ message: 'Reset password request declined, there is no account with this email' });
            }

            let resetPasswordToken = crypto.randomBytes(16).toString('hex');
            school.resetPasswordToken = resetPasswordToken;
            school.save();

            // send reset password email
            await Mail.sendForgotPasswordEmail(school.name, school.email, resetPasswordToken);

            return res.status(200)
                .json({ message: 'Reset password request approved, check your email for further instructions' });
        });
    }

    static async setForgotPassword(req, res) {
        let { email, token, password } = req.value.body;
        SchoolModel.findOne({ email }, async function (err, school) {
            if (!school || school.resetPasswordToken !== token) {
                return res.status(404).json({ message: 'Reset password failed, token is invalid' });
            }

            // Make hashed password
            const salt = await bcrypt.genSalt(10);
            let passwordHash = await bcrypt.hash(password, salt);

            // set new password
            school.password = passwordHash;
            school.resetPasswordToken = null;
            school.save();

            return res.status(200).json({ message: 'Reset password success, You can now log in using new password' });
        })
    }
}

module.exports = AuthController;