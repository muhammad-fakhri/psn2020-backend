let BookingModel = require('./BookingModel');
let StudentModel = require('../Student/StudentModel');
let TeacherModel = require('../Teacher/TeacherModel');
let ExcelJS = require('exceljs');
let AccommodationModel = require('../Accommodation/AccommodationModel')
class BookingController {
    static async create(req,res){
        try{
            let {userType, student, teacher, accommodation, startDate, duration} = req.value.body,
                booking = null,
                school = req.decoded.sub;
            if(userType == 'student'){
                booking = await BookingModel.create({school, userType, student, accommodation, startDate, duration});
                await StudentModel.findByIdAndUpdate({_id:student},{accommodationBooking:true,accommodationBookingId:booking._id});
            } else if(userType == 'teacher'){
                booking = await BookingModel.create({school, userType, teacher, accommodation, startDate, duration});
                await TeacherModel.findByIdAndUpdate({_id:teacher},{accommodationBooking:true,accommodationBookingId:booking._id});
            } else{
                throw new Error('userType invalid'); 
            }
            return res.status(201).json({message:"Success", booking});
        }catch(e){
            return res.status(400).json({message: e.message});
        }
    }
    static async list(req,res){
        try{
            let {privilege,sub} = req.decoded,
                {isFinal} = req.query,
                bookings = null,
                query = {};
            (isFinal !== null && isFinal !== undefined ? query.isFinal=isFinal:null);
            if(privilege == 'admin'){
                bookings = await BookingModel.find(query).populate('student teacher accommodation');
            }
            else if(privilege == 'school'){
                query.school = sub;
                bookings = await BookingModel.find(query).populate('student teacher accommodation');
            }
            else {
                throw new Error('Privilege invalid')
            }
            return res.status(200).json({bookings});
        }catch(e){
            return res.status(400).json({bookings:null, message:e.message});
        }
    }
    static async delete(req,res){
        try {
            let {_id} = req.params,
                booking = await BookingModel.findById({_id});
            if(booking.isFinal)
                return res.status(400).json({message:"Gagal", message:"Status booking telah final."})
            if(booking.userType == 'student'){
                await StudentModel.findByIdAndUpdate({_id:booking.student},{accommodationBooking:false,accommodationBookingId:null})
            }
            else if(booking.userType == 'teacher'){
                await TeacherModel.findByIdAndUpdate({_id:booking.teacher},{accommodationBooking:false,accommodationBookingId:null})
            }
            await booking.remove();
            return res.status(200).json({message:"Success",booking});
        
        } catch (e) {
            return res.status(400).json({message:e.message, booking:null});
        }
    }
    static async download(req,res){
        try {
            // let {accommodation} = req.params;
            let accommodations = await AccommodationModel.find();
            let workbook = new ExcelJS.Workbook();
            for (let i = 0; i < accommodations.length; i++) {
                let worksheet = workbook.addWorksheet(accommodations[i].name);
                worksheet.columns = [
                    {header: 'No', key: 'no', width:7},
                    {header: 'Nama Sekolah', key: 'school', width:35},
                    {header: 'Nama', key: 'name', width:35},
                    {header: 'Jenis User', key: 'userType', width:15},
                    {header: 'Nomor telepon', key: 'phone', width:15},
                    {header: 'Email', key: 'email', width:35},
                    {header: 'Tanggal Mulai', key: 'startDate', width:15},
                    {header: 'Durasi (Hari)', key: 'duration', width:15},
                    {header: 'Status Pembayaran', key: 'isPaid', width:15},
                ]
                let bookings = await BookingModel.find({accommodation:accommodations[i]._id}).populate('student teacher school');
                for (let j = 0, no=1; j < bookings.length; j++, no++) {
                    console.log(j,bookings);
                    let name = null, phone = null, email = null;
                    console.log(bookings[j]);
                    if(bookings[j].userType == 'student'){
                        // return res.json({mes:"disini masuk"});
                        name = bookings[j].student.name;
                        phone = bookings[j].student.phone;
                        email = bookings[j].student.email;
                    }
                    else{
                        name = bookings[j].teacher.name;
                        phone = bookings[j].teacher.phone;
                        email = bookings[j].teacher.email;
                    }
                    console.log(bookings[j].isPaid);
                    worksheet.addRow([
                        no,
                        bookings[j].school.name,
                        name,
                        bookings[j].userType,
                        phone,
                        email,
                        bookings[j].startDate.toISOString().split("T")[0],
                        bookings[j].duration,
                        bookings[j].isPaid,
                    ]);
                    worksheet.commit;
                }
            }
            let fileName = "Data booking penginapan "+new Date().toISOString().split("T")[0]+'.xlsx';
            let tempFilePath = __dirname+'/'+fileName;
            workbook.xlsx.writeFile(tempFilePath).then(()=>{
                console.log("Download list booking done");
                res.setHeader('Content-Disposition', 'attachment; filename=' + fileName);
                res.sendFile(tempFilePath,(e)=>{
                    if(e) console.log(e);
                })
            })
        } catch (e) {
            return res.status(400).json({message:e.message});
        }
    }
}
module.exports = BookingController;