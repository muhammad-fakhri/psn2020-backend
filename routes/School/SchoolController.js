const SchoolModel = require('./SchoolModel');
const SchoolNameModel = require('../Data/SchoolNameModel');
const TeamModel = require('../Team/TeamModel');
const StudentModel = require('../Student/StudentModel');
const bcrypt = require('bcryptjs');

class SchoolController {
    static async create(name, email, address, phone, province, password, verifyEmailToken) {
        try {
            // Make hashed password
            const salt = await bcrypt.genSalt(10);
            let passwordHash = await bcrypt.hash(password, salt);

            return await SchoolModel.create({
                name,
                email,
                address,
                phone,
                province,
                password: passwordHash,
                verifyEmailToken
            });
        } catch (e) {
            return res.status(500).json({ message: e.message });
        }
    }

    static async login(email, password) {
        try {
            let school = await SchoolModel.findOne({ email });
            return await school.isValidPassword(password);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    static async listAllSchools(req, res, next) {
        try {
            let schools = await SchoolModel.find({}, '_id name email address phone province isVerifiedEmail password');
            return res.status(200).json({ schools });
        }
        catch (e) {
            return res.status(500).json({ message: e.message });
        }
    }

    static async getModel() {
        return SchoolModel;
    }

    static async getSchoolDetailById(req, res) {
        try {
            let { schoolId } = req.params;
            await SchoolModel.exists({ _id: schoolId }, async function (err, result) {
                // if school not exist
                if (!result) return res.status(404).json({ message: 'School not found' });

                let school = await SchoolModel.findById(schoolId, '_id name email address phone province isVerifiedEmail');
                return res.status(200).json({ school });
            })
        } catch (e) {
            return res.status(500).json({ message: e.message });
        }
    }

    static async getSchoolDetail(req, res) {
        try {
            let { sub } = req.decoded;
            let school = await SchoolModel.findById(sub, '_id name email address phone province isVerifiedEmail');
            return res.status(200).json({ school });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    static async updateSchoolDetail(req, res) {
        try {
            let { schoolId, name, email, address, phone, province } = req.value.body;
            let school = await SchoolModel.findById(schoolId, '_id name email address phone province isVerifiedEmail');

            school.name = name;
            school.email = email;
            school.address = address;
            school.phone = phone;
            school.save();
            return res.status(200).json({ school });
        } catch (error) {
            return res.status(200).json({ message: error.message });
        }
    }

    static async search(req, res) {
        try {
            let { searchString, skip, limit } = req.query;
            if (!searchString) return res.status(400).json({ message: 'Some required data not provided' });
            let schools = await SchoolModel.find({
                name: {
                    $regex: new RegExp(searchString, "ig")
                }
            }, '_id name email address phone province isVerifiedEmail')
                .sort({ name: 'asc' })
                .skip(parseInt(skip) || 0)
                .limit(parseInt(limit) || 10);
            return res.status(200).json({ schools });
        } catch (e) {
            return res.status(500).json({ message: e.message });
        }
    }

    static async count(req, res) {
        try {
            let count = await SchoolModel.estimatedDocumentCount();
            return res.status(200).json({ totalSchool: count });
        } catch (e) {
            return res.status(500).json({ message: e.message });
        }
    }

    static async deleteSchools(req, res) {
        let { multiple } = req.query;
        let schoolIds = null;
        try {
            if (multiple === "true") {
                schoolIds = req.value.body.schoolIds;
                for (let index = 0; index < schoolIds.length; index++) {
                    await SchoolModel.exists({ _id: schoolIds[index] }, async function (err, result) {
                        if (result) {
                            // delete all team 
                            await TeamModel.deleteMany({ school: schoolIds[index] });

                            // delete all student
                            await StudentModel.deleteMany({ school: schoolIds[index] });

                            // delete school
                            await SchoolModel.findByIdAndDelete(schoolIds[index]);
                        }
                    });
                }

                return res.status(200).json({ message: "Schools deleted" });
            } else {
                schoolIds = req.value.body.schoolId;
                await SchoolModel.exists({ _id: schoolIds }, async function (err, result) {
                    if (result) {
                        // delete all team 
                        await TeamModel.deleteMany({ school: schoolIds });

                        // delete all student
                        await StudentModel.deleteMany({ school: schoolIds });

                        // delete school
                        await SchoolModel.findByIdAndDelete(schoolIds);
                        return res.status(200).json({ message: "School deleted" });
                    } else {
                        return res.status(404).json({ message: "School not found" });
                    }
                })
            }
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    static async getListSchoolNames(req, res) {
        let schoolNames = await SchoolNameModel.find({}, 'name').sort({ name: 'asc' });
        const schoolNamesArray = new Array();
        schoolNames.forEach(schoolName => {
            schoolNamesArray.push(schoolName.name);
        })
        return res.status(200).json({ schools: schoolNamesArray });
    }
}

module.exports = SchoolController;