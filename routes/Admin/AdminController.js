let AdminModel = require('./AdminModel');

class AdminController {
    static async createSubadmin(req, res) {
        try {
            let { name, email, password } = req.value.body;

            // Make sure account doesn't already exist
            AdminModel.findOne({ email }, async function (err, admin) {
                // If admin already exist
                if (admin) return res.status(409).json({ message: 'Create subadmin fail, email already exist' });

                // If not exist, create admin account
                let adminData = await AdminController.create(name, email, password);

                // remove unnecessary information
                adminData = adminData.toObject();
                delete adminData.password;

                return res.status(201).json({ admin: adminData });
            })
        } catch (e) {
            return res.status(500).json({ message: e.message, admin: null, token: null });
        }
    }
}

module.exports = AdminController;