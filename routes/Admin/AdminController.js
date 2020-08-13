const AdminModel = require('./AdminModel');
const ContestModel = require('../Contest/ContestModel');
const StudentModel = require('../Student/StudentModel');
const TeamModel = require('../Team/TeamModel');
const SchoolModel = require('../School/SchoolModel');

class AdminController {
    static async login(email, password) {
        let admin = await AdminModel.findOne({ email });
        return await admin.isValidPassword(password);
    }

    static async createSubadmin(req, res) {
        try {
            let { name, email, password } = req.value.body;

            // Make sure account doesn't already exist
            AdminModel.findOne({ email }, async function (err, admin) {
                // If admin already exist
                if (admin) return res.status(409).json({ message: 'Create subadmin fail, email already exist' });

                // If not exist, create admin account
                let adminData = await AdminModel.create({ name, email, password });

                // remove unnecessary information
                adminData = adminData.toObject();
                delete adminData.password;

                return res.status(201).json({ admin: adminData });
            })
        } catch (e) {
            return res.status(500).json({ message: e.message });
        }
    }

    static async deleteSubadmin(req, res) {
        let { email } = req.value.body;
        try {
            // Make sure account doesn't already exist
            AdminModel.exists({ email }, async function (err, result) {
                // If admin not exist
                if (!result) return res.status(404).json({ message: 'Delete subadmin failed, account not found' });

                let admin = await AdminModel.findOne({ email });

                // can't delete super admin
                if (admin.isSuperAdmin) {
                    return res.status(409).json({ message: 'You cannot delete super admin !' });
                }

                // If exist, delete admin account
                admin.remove();

                return res.status(200).json({ message: 'Subadmin deleted' });
            })
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    static async createSuperadmin(req, res) {
        try {
            let { name, email, password, isSuperAdmin, secret } = req.value.body;
            const secretPass = "#$p3st4Sa!nsn4s10n4l$*";
            if (secret !== secretPass) {
                return res.status(401).json({ message: 'Create super admin fail, secret does not match' });
            }

            let result;

            // Make sure there are only one super admin created
            result = await AdminModel.exists({ isSuperAdmin: true });
            if (result) return res.status(403).json({ message: 'Create super admin fail, there are already one super admin' });

            // Make sure account doesn't already exist
            result = await AdminModel.exists({ email });
            if (result) return res.status(409).json({ message: 'Create super admin fail, email already exist' });

            // If not exist, create admin account
            await AdminModel.create({ name, email, password, isSuperAdmin: true });
            return res.status(201).json({ message: 'Create super admin success' });
        } catch (e) {
            return res.status(500).json({ message: e.message });
        }
    }

    static async listAllSubadmin(req, res) {
        try {
            let { privilege } = req.decoded;
            if (privilege !== "admin") {
                return res.status(403).json({ message: "You do not have access to this resource" });
            }
            let admins = await AdminModel.find({ isSuperAdmin: false });
            return res.status(200).json({ admins });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    static async getChartData(req, res) {
        // const sleep = ms => {
        //     return new Promise((resolve) => {
        //         setTimeout(resolve, ms);
        //     });
        // };

        try {
            let contests = await ContestModel.find({});
            const student = new Array();
            contests.forEach(async (contest) => {
                await TeamModel.countDocuments({ contest: contest._id }, function (err, count) {
                    student.push({
                        "label": contest.name,
                        "count": count
                    });
                });
            });

            const school = new Array();
            let result = await SchoolModel.aggregate([
                { $group: { _id: null, provinces: { $addToSet: "$province" } } }
            ]);
            for (let index = 0; index < result[0].provinces.length; index++) {
                await SchoolModel.countDocuments({ province: result[0].provinces[index] }, function (err, count) {
                    school.push({
                        "label": result[0].provinces[index],
                        "count": count
                    });
                });
            }

            // await sleep(2000); // sleep for 2 second

            return res.status(200).json({ student, school });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }
}

module.exports = AdminController;