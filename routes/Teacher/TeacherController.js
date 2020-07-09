let TeacherModel = require('./TeacherModel');
let ExcelJS = require('exceljs');

class TeacherController {
    constructor(params) {
        
    }
    static async create(req,res){
        try{
            let {name, email, phone, NIP, school} = req.value.body,
                teacher = await TeacherModel.create({name, email, phone, NIP, school});
            return res.status(201).json({message:"Success",teacher});
        }catch(e){
            return res.status(400).json({message:e.message,teacher:null});
        }
    }
    static async listBySchool(req,res){
        try{
            let {school} = req.params,
                teachers = await TeacherModel.find({school});    
            return res.status(200).json({message:"Success", teachers});
        }
        catch(e){
            return res.status(400).json({message:e.message, teachers:null});
        }
    }
    
    //Admin Only
    static async list(req,res){ 
        try{
            let teachers = await TeacherModel.find({});    
            return res.status(200).json({message:"Success", teachers});
        }
        catch(e){
            return res.status(400).json({message:e.message, teachers:null});
        }
    }

    static async edit(req,res){
        try{
            let {_id, name, email, phone, NIP, school} = req.value.body,
                teacher = await TeacherModel.findByIdAndUpdate({_id},{name, email, phone, NIP, school});
            return res.status(201).json({message:"Success"});
        }catch(e){
            return res.status(400).json({message:e.message});
        }
    }
    static async delete(req,res){
        try{
            let {_id} = req.params,
                teacher = await TeacherModel.findByIdAndRemove({_id});
            return res.status(201).json({message:"Success"});
        }catch(e){
            return res.status(400).json({message:e.message});
        }
    }
    static async get(req,res){
        try{
            let {_id} = req.params,
            teacher = await TeacherModel.findById({_id});
            return res.status(200).json({message:"Success", teacher});
        }catch(e){
            return res.status(400).json({message:e.message, teacher:null});
        }
    }
    static async findBySchool(school){
        try{
            let teachers = await TeacherModel.find({school,isPaid:{$ne:true}});
            return teachers;
        }catch(e){
            throw e;
        }
    }
    static async count(req,res){
        try {
            let {school} = req.params,
                totalTeacher = await TeacherModel.count({school});
            return res.status(200).json({totalTeacher});
        } catch (e) {
            return res.status(400).json({message:e.message, totalTeacher:null});
        }
    }
    static async getUnpaid(req,res){
        try {
            let {school} = req.params,
                teachers = await TeacherModel.find({school,isPaid:false});
            return res.status(200).json({teachers});
        } catch (e) {
            return res.status(400).json({message:e.message});
        }
    }
    static async getUnbooked(req,res){
        try {
            let {school}=req.params,
                teachers = await TeacherModel.find({accommodationBooking:false,school});
            return res.status(200).json({teachers});
        } catch (e) {
            return res.status(400).json({message:e.message});
        }
    }
    static async getExcel(req,res){
        try {
            let teachers = await TeacherModel.find({}).populate('school');
            let workbook = new ExcelJS.Workbook();
            let worksheet = workbook.addWorksheet("Daftar Guru");
            worksheet.columns = [
                {header: 'No', key: 'no', width: 4},
                {header: 'Nama Guru', key: 'name', width: 20},
                {header: 'Email', key: 'email', width: 20},
                {header: 'Telepon', key: 'phone', width: 20},
                {header: 'NIP', key: 'nip', width: 20},
                {header: 'Nama Sekolah', key: 'school', width: 20},
                {header: 'Status Pemabayaran', key: 'isPaid', width: 20},
            ];
            let no = 1;
            for (let i = 0; i < teachers.length; i++,no++) {
                worksheet.addRow([
                    no,
                    teachers[i].name,
                    teachers[i].email,
                    teachers[i].phone,
                    teachers[i].NIP,
                    teachers[i].school.name,
                    teachers[i].isPaid2,
                ]);
                worksheet.commit;
            }
            let fileName = "Daftar Guru "+new Date().toISOString().split("T")[0]+'.xlsx';
            let tempFilePath = __dirname+'/'+fileName;
            workbook.xlsx.writeFile(tempFilePath).then(()=>{
                console.log("done");
                res.setHeader('Content-Disposition', 'attachment; filename=' + fileName);
                res.sendFile(tempFilePath,(e)=>{
                    console.log(e);
                })
            })
        } catch (e) {
            return res.status(400).json({message:e.message});
        }
    }
}

module.exports = TeacherController;