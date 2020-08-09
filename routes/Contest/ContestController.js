const ContestModel = require('./ContestModel');
const TeamModel = require('../Team/TeamModel');
const StudentModel = require('../Student/StudentModel');

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

                let teams = await TeamModel.find({ contest: contestId });
                console.log(teams);

                // check there is already team that is final or not
                for (let index = 0; index < teams.length; index++) {
                    if (teams[index].isFinal) {
                        return res.status(409).json({ message: "Delete contest fail, there are already team that is final" });
                    }
                }

                // delete all team in the contest and update team id in each student data
                for (let i = 0; i < teams.length; i++) {
                    for (let j = 0; j < teams[i].students.length; j++) {
                        await StudentModel.findByIdAndUpdate(teams[i].students[j], { team: null });
                    }
                    // delete team
                    await teams[i].remove();
                }

                await ContestModel.findByIdAndDelete(contestId);
                return res.status(200).json({ message: "Contest deleted" });
            })
        } catch (e) {
            return res.status(500).json({ message: e.message });
        }
    }
}

module.exports = ContestController;