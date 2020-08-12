let AdminModel = require('./AdminModel');

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
}

module.exports = AdminController;