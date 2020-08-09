let ContestModel = require('./ContestModel');
let TeamModel = require('../Team/TeamModel');

class ContestController {
    static async create(req, res) {
        try {
            let { name, memberPerTeam, maxTeam, img, registrationStatus, pricePerStudent } = req.value.body,
                contest = await ContestModel.create({ name, memberPerTeam, maxTeam, imgPath: img, pricePerStudent, registrationStatus });
            return res.status(201).json({ contest });
        } catch (e) {
            return res.status(500).json({ message: e.message })
        }
    }

    static async list(req, res) {
        try {
            let { registrationStatus } = req.query,
                contests = await ContestModel.find(registrationStatus ? { registrationStatus } : {}),
                contestsData = new Array();

            for (let i = 0; i < contests.length; i++) {
                let contest = contests[i].toObject();
                contest.registeredTeam = await TeamModel.count({ contest: contest._id });
                contestsData.push(contest);
            }
            return res.status(200).json({ contests: contestsData });
        } catch (e) {
            return res.status(500).json({ message: e.message })
        }
    }

    static async edit(req, res) {
        try {
            let { _id, name, memberPerTeam, maxTeam, img, pricePerStudent, registrationStatus } = req.value.body;

            await ContestModel.exists({ _id }, async function (err, result) {
                if (!result) return res.status(404).json({ message: "Contest not found" });
                await ContestModel.findByIdAndUpdate({ _id },
                    { name, memberPerTeam, maxTeam, imgPath: img, pricePerStudent, registrationStatus });
                let contest = await ContestModel.findById(_id);
                return res.status(200).json({ contest });
            })
        } catch (e) {
            return res.status(500).json({ message: e.message });
        }
    }

    static async delete(req, res) {
        try {
            let { contestId } = req.params;

            await ContestModel.exists({ _id: contestId }, async function (err, result) {
                if (!result) return res.status(404).json({ message: "Contest not found" });
                // TODO: check there is already team that is final or not
                // TODO: update contest id in all team
                await ContestModel.findByIdAndDelete(contestId);
                return res.status(200).json({ message: "Contest deleted" });
            })
        } catch (e) {
            return res.status(500).json({ message: e.message });
        }
    }
}

module.exports = ContestController;