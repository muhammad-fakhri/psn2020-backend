const TeamModel = require('./TeamModel');
const ContestModel = require('../Contest/ContestModel');
const StudentModel = require('../Student/StudentModel');
const SchoolModel = require('../School/SchoolModel');
const ExcelJS = require('exceljs');

class TeamController {
    static async create(req, res) {
        try {
            let { name, contest, students, schoolId } = req.value.body;

            // Check contest quota
            let contestData = await ContestModel.findById({ _id: contest });
            let registeredTeam = await TeamModel.countDocuments({ contest });
            if (registeredTeam >= contestData.maxTeam) {
                return res.status(409).json({ message: "Contest quota is full" })
            }
            // Check contest availability
            if (contestData.registrationStatus === "close") {
                return res.status(409).json({ message: "Contest registration is closed" })
            }

            // check student, are they already in a team or not
            for (let index = 0; index < students.length; index++) {
                let student = await StudentModel.findById(students[index]);
                if (student.team) {
                    return res.status(409).json({ message: "Create team fail, some student already in a team" })
                }
            }

            // create team
            let team = await TeamModel.create({ name, contest, school: schoolId, students });
            students.forEach(async (student) => {
                await StudentModel.findByIdAndUpdate(student, { team: team._id });
            })
            // update registered team field in contest
            ++contestData.registeredTeam;
            contestData.save();

            return res.status(201).json({ team });
        } catch (e) {
            return res.status(500).json({ message: e.message });
        }
    }

    static async list(req, res) {
        try {
            let { privilege } = req.decoded;
            let { school, contest, populateContest, populateStudent } = req.query;

            // if no parameter is used
            if (!school && !contest) {
                if (privilege !== 'admin') {
                    return res.status(403).json({ message: "You do not have access to this resource" });
                }
            }

            let teams = new Array();
            if (school) {
                // check school is exist or not
                await SchoolModel.exists({ _id: school }, async function (err, result) {
                    // if not exist return empty array
                    if (!result) return res.status(200).json({ teams });
                    teams = await TeamModel.find({ school })
                        .populate((populateContest === 'true' ? 'contest' : ''))
                        .populate((populateStudent === 'true' ? 'students' : ''));
                    return res.status(200).json({ teams });
                });
            } else if (contest) {
                // check contest is exist or not
                await ContestModel.exists({ _id: contest }, async function (err, result) {
                    // if not exist return empty array
                    if (!result) return res.status(200).json({ teams });
                    teams = await TeamModel.find({ contest })
                        .populate((populateContest === 'true' ? 'contest' : ''))
                        .populate((populateStudent === 'true' ? 'students' : ''));
                    return res.status(200).json({ teams });
                });
            } else {
                teams = await TeamModel.find({})
                    .populate((populateContest === 'true' ? 'contest' : ''))
                    .populate((populateStudent === 'true' ? 'students' : ''));
                return res.status(200).json({ teams });
            }
        } catch (e) {
            return res.status(500).json({ message: e.message });
        }
    }

    static async get(req, res) {
        try {
            let { teamId } = req.params,
                { sub, privilege } = req.decoded,
                { populateContest, populateStudent } = req.query;

            await TeamModel.exists({ _id: teamId }, async function (err, result) {
                if (!result) {
                    return res.status(404).json({ message: "Team not found" });
                }

                let team = await TeamModel.findById(teamId)
                    .populate((populateContest === 'true' ? 'contest' : ''))
                    .populate((populateStudent === 'true' ? 'students' : ''));

                if (privilege === "school") {
                    if (sub != team.school) {
                        return res.status(403).json({ message: "You do not have access to this resource" });
                    }
                }

                return res.status(200).json({ team });
            });
        } catch (e) {
            return res.status(500).json({ message: e.message });
        }
    }

    static async update(req, res) {
        try {
            let { _id, name, contest, students } = req.value.body,
                { sub, privilege } = req.decoded;

            await TeamModel.exists({ _id }, async function (err, result) {
                if (!result) {
                    return res.status(404).json({ message: "Team not found" });
                }

                let team = await TeamModel.findById({ _id });

                if (privilege === "school") {
                    if (team.school != sub) {
                        return res.status(403).json({ message: "You do not have access to this resource" });
                    }
                }

                // check team already final or not
                if (team.isFinal) {
                    return res.status(409).json({ message: "Update team fail, team data with the given ID already final" });
                }

                // delete team id from old student members
                team.students.forEach(async (student) => {
                    await StudentModel.findByIdAndUpdate(student, { team: null });
                });

                // update team data
                await team.updateOne({ name, contest, students });

                // update team id in new student members data
                students.forEach(async (student) => {
                    await StudentModel.findByIdAndUpdate(student, { team: team._id });
                });

                let teamData = await TeamModel.findById(_id);
                return res.status(200).json({ team: teamData });
            });
        } catch (e) {
            return res.status(500).json({ message: e.message })
        }
    }

    static async delete(req, res) {
        try {
            let { teamId } = req.params,
                { sub, privilege } = req.decoded;

            await TeamModel.exists({ _id: teamId }, async function (err, result) {
                if (!result) {
                    return res.status(404).json({ message: "Team not found" });
                }

                let team = await TeamModel.findById(teamId);

                if (privilege === 'school') {
                    if (sub != team.school) {
                        return res.status(403).json({ message: "You do not have access to this resource" });
                    }
                }

                if (team.isFinal) {
                    return res.status(409).json({ message: "Delete team fail, team data with the given ID already final" });
                } else if (team.isPaid) {
                    return res.status(409).json({ message: "Delete team fail, team data with the given ID already paid" });
                }

                team.students.forEach(async function (student) {
                    await StudentModel.findByIdAndUpdate(student, { team: null });
                });

                await team.remove();
                return res.status(200).json({ message: "Team deleted" });
            })
        } catch (e) {
            return res.status(500).json({ message: e.message });
        }
    }

    static async count(req, res) {
        try {
            let totalTeams = await TeamModel.estimatedDocumentCount();
            return res.status(200).json({ totalTeams });
        } catch (e) {
            return res.status(500).json({ message: e.message });
        }
    }

    static async getExcelByContest(req, res) {
        try {
            let { contestId } = req.params,
                contest = await ContestModel.findById(contestId);
            let teams = await TeamModel.find({ contest: contest._id }).populate({
                path: "students school",
            });

            // Create Excel
            let workbook = new ExcelJS.Workbook();
            // workbook.properties.;
            let worksheet = workbook.addWorksheet(contest.name);
            worksheet.columns = [
                { header: 'No', key: 'no', width: 4 },
                { header: 'Tim', key: 'team', width: 15 },
                { header: 'Nama Siswa', key: 'name', width: 15 },
                { header: 'Email', key: 'email', width: 15 },
                { header: 'Nomor Telepon', key: 'phone', width: 15 },
                { header: 'Nama Sekolah', key: 'school', width: 15 },
                { header: 'Nama Lomba', key: 'contestName', width: 15 },
                { header: 'Status Pembayaran', key: 'isPaid', width: 15 },
            ]

            let no = 1;
            for (let i = 0; i < teams.length; i++) {
                for (let j = 0; j < teams[i].students.length; j++, no++) {
                    worksheet.addRow([
                        no,
                        teams[i].name,
                        teams[i].students[j].name,
                        teams[i].students[j].email,
                        teams[i].students[j].phone,
                        teams[i].school.name,
                        contest.name,
                        (teams[i].isPaid ? 'Sudah' : 'Belum'),
                    ])
                    worksheet.commit;
                }
            }

            let fileName = contest.name + " " + new Date().toISOString().split("T")[0] + '.xlsx';
            let tempFilePath = process.cwd() + '/public/' + fileName;
            workbook.xlsx.writeFile(tempFilePath).then(() => {
                res.setHeader('Content-Disposition', 'attachment; filename=' + fileName);
                res.sendFile(tempFilePath, (err) => {
                    if (err) {
                        next(err)
                    } else {
                        console.log('Sent:', fileName)
                    }
                })
            })
        } catch (e) {
            return res.status(500).json({ message: e.message })
        }
    }

    static async multipleDelete(req, res) {
        try {
            let { teamIds } = req.body;

            for (let index = 0; index < teamIds.length; index++) {
                let team = await TeamModel.findById(teamIds[index]);
                if (team) {
                    if (!team.isFinal) {
                        team.students.forEach(async function (student) {
                            await StudentModel.findByIdAndUpdate(student, { team: null });
                        });
                        await team.remove();
                    }
                }
            }
            return res.status(200).json({ message: "Team deleted" });
        } catch (e) {
            return res.status(500).json({ message: e.message });
        }

    }
}

module.exports = TeamController;