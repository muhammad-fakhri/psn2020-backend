let ContestModel = require('./ContestModel');
let TeamModel = require('../Team/TeamModel');

class ContestController {
    static async create(req, res) {
        let { privilege } = req.decoded;
        try {
            if (privilege !== 'admin') {
                return res.status(403).json({ message: "You do not have access to this resource" });
            }
            let { name, memberPerTeam, maxTeam, img, registrationStatus, pricePerStudent } = req.value.body,
                contest = await ContestModel.create({ name, memberPerTeam, maxTeam, imgPath: img, pricePerStudent, registrationStatus });
            return res.status(201).json({ contest });
        } catch (e) {
            return res.status(500).json({ message: e.message, contest: null })
        }
    }

    static async list(req, res) {
        try {
            let { registrationStatus } = req.query,
                contests = await ContestModel.find(registrationStatus ? { registrationStatus } : {});
            return res.status(200).json({ contests });
        } catch (e) {
            return res.status(500).json({ message: e.message })
        }
    }

    static async edit(req, res) {
        let { privilege } = req.decoded;
        if (privilege != 'admin')
            return res.status(401).json({ message: "Not allowed.", contest: null });
        try {
            let { _id, name, memberPerTeam, maxTeam, img, pricePerStundent, registrationStatus } = req.value.body;
            await ContestModel.findByIdAndUpdate({ _id }, { name, memberPerTeam, maxTeam, img, pricePerStundent, registrationStatus });
            return res.status(200).json({ message: "Success" });
        } catch (e) {
            return res.status(500).json({ message: "Failed" });
        }
    }

    static async delete(req, res) {
        let { privilege } = req.decoded;
        if (privilege != 'admin')
            return res.status(401).json({ message: "Not allowed.", contest: null });
        try {
            let { _id } = req.params,
                contest = await ContestModel.findByIdAndDelete({ _id });
            return res.status(200).json({ message: "Success", contest });
        } catch (e) {
            return res.status(500).json({ message: "Failed", contest: null });
        }
    }
}

module.exports = ContestController;