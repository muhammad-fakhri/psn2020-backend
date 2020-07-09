let TeamModel = require('./TeamModel');
let ContestModel = require('../Contest/ContestModel');
let StudentModel = require('../Student/StudentModel');
let ExcelJS = require('exceljs');

class TeamController {
    constructor(params) {
        
    }
    static async create(req,res){
        try{
            let {name, contest, student} = req.value.body,
                {privilege,sub} = req.decoded;
            if(privilege != 'school'){
                return res.status(401).json({success:false,team:null});
            }
            contest = await ContestModel.findById({_id:contest});
            let maxTeam = contest.maxTeam;
            let teamRegistered = await TeamModel.count({contest});
            if(teamRegistered >= maxTeam){
                return res.status(200).json({success:false, message:"Kuota sudah penuh", team:null})
            }
            let team = await TeamModel.create({name, contest, school:sub, student});
            for (let i = 0; i < student.length; i++) {
                await StudentModel.findByIdAndUpdate({_id:student[i]},{team:team._id});
            }
            return res.status(201).json({success:true,team});
        }catch(e){
            return res.status(400).json({success:false,team:null,message:e.message});
        }
    }
    static async list(req,res){
        try{
            let {school, contest, populateContest, populateStudent} = req.query, teams=null;
            if(school){
                teams = await TeamModel.find({school})
                .populate((populateContest==1?'contest':''))
                .populate((populateStudent==1?'student':''));
            }else if(contest){
                teams = await TeamModel.find({contest})
                .populate((populateContest==1?'contest':''))
                .populate((populateStudent==1?'student':''));
            }else{
                teams = await TeamModel.find({})
                .populate((populateContest==1?'contest':''))
                .populate((populateStudent==1?'student':''));
            }
            return res.status(200).json({message:"Success",teams});
        }catch(e){
            return res.status(500).json({message:e.message,teams:null});
        }
    }
    static async get(req,res){
        try{
            let {_id} = req.params, {populateContest,populateStudent} = req.query,
                team = await TeamModel.findById({_id})
                .populate((populateContest==1?'contest':''))
                .populate((populateStudent==1?'student':''));
            return res.status(200).json({message:"Success", team});
        }catch(e){
            return res.status(500).json({message:e.message, team:null});
        }
    }
    static async edit(req,res){
        try{
            let {_id, name, student} = req.value.body,
                {sub, privilege} = req.decoded,
                team = await TeamModel.findById({_id});
            if(team.school != sub){
                return res.status(401).json({message:"Not allowed, school id not match."});
            }
            // hapus id tim di student
            for (let i = 0; i < team.student.length; i++) {
                await StudentModel.findByIdAndUpdate({_id:team.student[i]},{team:null});
            } 
            await team.update({name,student});
            // assign id tim ke student baru
            for (let i = 0; i < student.length; i++) {
                await StudentModel.findByIdAndUpdate({_id:student[i]},{team:team._id});
            }
            return res.status(200).json({message:"Success"});
        }catch(e){
            return res.status(400).json({message:e.message})
        }
    }
    static async delete(req,res){
        try{
            let {_id} = req.params,
                {sub} = req.decoded,
                team = await TeamModel.findById({_id});
            console.log(_id);
            // if(sub != team.school){
            //     return res.status(401).json({message:"Not allowed, school id not match."});
            // }
            for (let i = 0; i < team.student.length; i++) {
                await StudentModel.findByIdAndUpdate({_id:team.student[i]},{team:null});
            }
            if(team.isPaid == true)
                return res.status(400).json({success:false, message:"Team sudah dibayar, tidak dapat dihapus."});
            await team.remove();
            return res.status(200).json({success:true, message:"Success"});
        }catch(e){
            return res.status(400).json({success:false, message:e.message});
        }
    }
    static async populatedTeams(teams){
        let populatedTeams = [];
        for(let i=0;i<teams.length;i++){
            let temp = await TeamModel.findById({_id:teams[i]}).populate('contest','pricePerStudent');
            populatedTeams.push(temp);
        }
        return populatedTeams;
    }
    static async findBySchool(school,populate){
        try{
            let teams = null;
            if(populate){
                teams = await TeamModel.find({school,isPaid:{$ne:true}}).populate(populate);
            }
            return teams;
        }
        catch(e){
            throw e;
        }
    }
    static async count(req,res){
        try {
            let {school} = req.params,
                totalTeams = await TeamModel.count({school});
            return res.status(200).json({totalTeams});
        } catch (e) {
            return res.status(400).json({message:e.message, totalTeams:null});
        }
    }
    static async getUnpaid(req,res){
        try {
            let {school} = req.params, {populateContest,populateStudent}=req.query,
                teams = await TeamModel.find({school, isPaid:false})
                .populate((populateContest==1?'contest':''))
                .populate((populateStudent==1?'student':''));
            // console.log(school)
            return res.status(200).json({teams});
        } catch (e) {
            return res.status(400).json({message:e.message});
        }
    }
    static async getExcelByContest(req,res){
        try{
            let {contest} = req.params;
            contest = await ContestModel.findById({_id:contest});
            let participants = await TeamModel.find({contest:contest._id}).populate({
                path: "student school",
            });
            
            // Create Excel
            let workbook = new ExcelJS.Workbook();
            workbook.properties
            let worksheet = workbook.addWorksheet(contest.name);
            worksheet.columns = [
                {header: 'No', key: 'no', width: 4},
                // {header: 'Id', key: '_id', width: 10},
                {header: 'Tim', key: 'team', width:15},
                {header: 'Nama Siswa', key: 'name', width:15},
                {header: 'Email', key: 'email', width:15},
                {header: 'Nomor Telepon', key: 'phone', width:15},
                {header: 'Nama Sekolah', key: 'school', width:15},
                {header: 'Nama Lomba', key: 'contestName', width:15},
                {header: 'Status Pembayaran', key: 'isPaid', width:15},
            ]
            // return res.json({participants});
            let no = 1;
            for (let i = 0; i < participants.length; i++) {
                for (let j = 0; j < participants[i].student.length; j++,no++) {
                    worksheet.addRow([
                        no,
                        // participants[i]._id,
                        participants[i].name,
                        participants[i].student[j].name,
                        participants[i].student[j].email,
                        participants[i].student[j].phone,
                        participants[i].school.name,
                        contest.name,
                        participants[i].isPaid2,
                    ])
                    worksheet.commit;
                }
            }
            let fileName = contest.name+" "+new Date().toISOString().split("T")[0]+'.xlsx';
            let tempFilePath = __dirname+'/'+fileName;
            workbook.xlsx.writeFile(tempFilePath).then(()=>{
                console.log("done");
                res.setHeader('Content-Disposition', 'attachment; filename=' + fileName);
                res.sendFile(tempFilePath,(e)=>{
                    console.log(e);
                })
            })
            // return res.json({workbook});
            // worksheet.commit();

            // await this.sendWorkbook(workbook,res);
        }catch(e){
            return res.json({message: e.message})
        }
    }
    // static async sendWorkbook(workbook, response) { 
    //     var fileName = 'FileName.xlsx';
    
    //     response.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    //     response.setHeader("Content-Disposition", "attachment; filename=" + fileName);
    
    //      await workbook.xlsx.write(response);
    
    //     response.end();
    // }
}

module.exports = TeamController;