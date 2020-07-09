let BillModel = require('./BillModel');
// let TeamController = require('../Team/TeamController');
let TeamModel = require('../Team/TeamModel');
// let TeacherController = require('../Teacher/TeacherController');
let SchoolModel = require('../School/SchoolModel');
let StudentModel = require('../Student/StudentModel');
let TeacherModel = require('../Teacher/TeacherModel');
let PaymentEncription = require('../Midleware/PaymentEncription');
let axios = require('axios');
let BookingModel = require('../Booking/BookingModel');
let mongoose = require('mongoose');
// let cid = '00298', sck = '787b175aeb54a1e133fb71b5d2ebe11d'; // credential dev
let cid = '00773', sck = '61c16a7e0dab54a0709ad748f485951e'; // credential prod
let ParamModel = require('../Params/ParamModel');
class BillController {
    constructor(params) {
        
    }
    static async create(req,res,next){
        try{ //only for school
            let {type, school} = req.value.body, 
                totalPrice = 0,
                cid = '00773',
                sck = '61c16a7e0dab54a0709ad748f485951e',
                teams=null,
                teachers=null,
                students=null,
                bookings=null,
                numberOfStudent=0,
                numberOfTeacher=null,
                trx_id = mongoose.Types.ObjectId(),
                lastVA = await ParamModel.findOne({code:"LAST_VA"}),
                firstVA = Math.floor(1000 + Math.random() * 9000),
                virtual_account = "98800773"+firstVA.toString() + lastVA.value,
                nextValue = (parseInt(lastVA.value)+1).toString();
            lastVA.value = "0".repeat(4-nextValue.length)+nextValue;
            lastVA.save();
            console.log(virtual_account);
            school = await SchoolModel.findById({_id:school});
            if(type == 'registration'){
                teams = await TeamModel.find({school,isPaid:{$ne:true}}).populate({path: 'contest'}); //TeamController.findBySchool(school._id,{path: 'contest'});
                teachers = await TeacherModel.find({school:school._id, isPaid : {$ne:true}});//TeacherController.findBySchool(school._id);
                numberOfTeacher = teachers.length;
                if(teams.length == 0 && teachers.length == 0)
                    return res.status(400).json({message:"Tidak ada tim atau guru pendamping yang belum dibayar. Silahkan tambahkan tim atau guru pendamping baru.",bill:null}); 
                let totalStudent = await StudentModel.count({school:school._id}),
                    totalTeacher = await TeacherModel.count({school:school._id});
                if(teams.length != 0){
                    for(let i=0; i<teams.length; i++){
                        let price = parseInt(teams[i].contest.memberPerTeam) * parseInt(teams[i].contest.pricePerStudent);
                        console.log(40,price,teams[i].contest.memberPerTeam,teams[i].contest.pricePerStudent);
                        totalPrice+=price;
                        numberOfStudent += teams[i].contest.memberPerTeam;
                        teams[i].isPaid = true;
                        await teams[i].save();
                    }
                }
                console.log(46, totalPrice);
                if(teachers.length != 0){
                    let jatahMurah, jatahMurahDipakai, jatahMurahSisa, bayarMahal, jatahMurahBakalDipakai;
                    if (totalStudent > 0 && totalStudent <= 5) {
                        jatahMurah = 1;
                    } else if (totalStudent > 5 && totalStudent <= 15) {
                        jatahMurah = 2;
                    } else if (totalStudent > 15 && totalStudent <= 30) {
                        jatahMurah = 3;
                    } else {
                        jatahMurah = 4;
                    }
                    jatahMurahDipakai = (totalTeacher - numberOfTeacher >= jatahMurah ? jatahMurah : totalTeacher - numberOfTeacher);
                    jatahMurahSisa = jatahMurah - jatahMurahDipakai;
                    jatahMurahBakalDipakai = (numberOfTeacher >= jatahMurahSisa ? jatahMurahSisa : numberOfTeacher);
                    bayarMahal = (numberOfTeacher - jatahMurahSisa < 0 ? 0 : numberOfTeacher - jatahMurahSisa);
                    totalPrice += jatahMurahBakalDipakai * 50000 + bayarMahal * 100000;;
                    for(let i=0; i<numberOfTeacher; i++){
                        teachers[i].isPaid = true;
                        await teachers[i].save();
                    }
                }
                console.log(87, totalPrice);
            }else if(type == 'accommodation'){
                /**
                 * Disini proses penghitungan tagihan penginapan.
                 * 1. Ambil data booking berdasarkan sekolah
                 * 2. Hitung jumlah biaya per orang berdasarkan accommodation
                 * 3. POST ke bank
                 * 4. simpan ke DB
                 */
                bookings = await BookingModel.find({school, isFinal:false}).populate('accommodation');
                // console.log(bookings);
                teachers = []; 
                students = [];
                for(let i=0; i<bookings.length; i++){
                    console.log(totalPrice,bookings[i].accommodation.pricePerNight,bookings[i].duration);
                    totalPrice+=bookings[i].accommodation.pricePerNight*bookings[i].duration; // Kurang atribut durasi booking
                    bookings[i].isFinal = true;
                    bookings[i].save();
                    if(bookings[i].userType == 'teacher'){
                        teachers.push(bookings[i].teacher);
                    }
                    else{
                        students.push(bookings[i].student);
                    }
                }
                // return res.json({bookings,totalPrice});
            }else{
                throw new Error('invalid bill type');
            }
            console.log(108, totalPrice,virtual_account);
            totalPrice += 5000; //Biaya admin
            // totalPrice += Math.floor(Math.random()*(899)+100);
            // throw new Error(totalPrice);
            let data = {
                type:"createbilling",
                client_id: cid,
                trx_id,
                trx_amount: totalPrice,
                billing_type : "c",
                customer_name : school.name,
                virtual_account
            }
            let encryptedData = PaymentEncription.encrypt(data,cid,sck),
                // 3001 => dev, 3002 => prod
                request = await axios({
                    method: 'post',
                    headers: {'Content-Type':'application/json'},
                    url: 'http://103.56.206.107:3002/create',
                    data: {
                        client_id: cid,
                        data: encryptedData
                    }
                });
            console.log(request,data,request.data);
            let bill = null; // result = request.data.data, decryptedData = PaymentEncription.decrypt(result.data,cid,sck);
                
            // console.log(data);
            if(type == 'registration'){
                bill = await BillModel.create({
                    _id:trx_id,type,totalPrice,VANumber:virtual_account,
                    payment:{status:'waiting'},school,registration:
                    {
                        teams,teachers,numberOfStudent:numberOfStudent,numberOfTeacher:numberOfTeacher
                    }
                });
            }
            else if(type=='accommodation'){
                bill = await BillModel.create({
                    _id:trx_id,type,totalPrice,VANumber:virtual_account,
                    payment:{status:'waiting'},school,accommodation:
                    {
                        teachers:teachers,students:students,bookings
                    }
                });
                // return res.json({bill,students, teachers})
            }
            return res.status(201).json({bill});
        }catch(e){
            res.status(400).json({message: e.message});
        }
    }
    static async callback(req,res,next){
        // urus lagi nanti, update bill ke database
        try {
            let {client_id, data} = req.body,
                decryptedData = PaymentEncription.decrypt(data,cid,sck);
            // let bill = await BillModel.findByIdAndUpdate({_id:decryptedData.trx_id},{payment:{status:'paid',data:Date.now()}});
            console.log(data,decryptedData);
            let bill = await BillModel.findById({_id:decryptedData.trx_id});
            if(bill == null || bill == undefined){
                throw new Error(`Bill with id ${decryptedData.trx_id} not found`);
            }
            bill.payment.status='paid';
            bill.payment.date=Date.now();
            if(bill.type == 'accommodation'){
                for (let i = 0; i < bill.accommodation.bookings.length; i++) {
                    let booking = await BookingModel.findByIdAndUpdate({_id:bill.accommodation.bookings[i]},{isPaid:true});
                    // console.log(booking);
                }
            }
            if(bill.type == 'registration'){
                for (let i = 0; i < bill.registration.teams.length; i++) {
                    await TeamModel.findByIdAndUpdate({_id:bill.registration.teams[i]},{
                        isPaid2:true
                    });
                }
                for (let i = 0; i < bill.registration.teachers.length; i++) {
                    await TeacherModel.findByIdAndUpdate({_id:bill.registration.teachers[i]},{
                        isPaid2:true
                    });
                }
            }
            await bill.save();
            console.log({trx: data.trx_id, message:"Bill berhasil diupdate"});
            return res.json({trx: data.trx_id, message:"Bill berhasil diupdate",status:"000"});
        } catch (e) {
            return res.json({message:e.message});
        }
    }
    static async get(req,res){
        let {_id} = req.params;
        try{
            let bill = await BillModel.findById({_id});
            return res.json({bill});
        }catch(e){
            return res.json({message:e.message});
        }
    }
    static async listBySchool(req,res){
        let {school} = req.params;
        try{
            let bills = await BillModel.find({school});
            return res.json({bills});
        }catch(e){
            return res.json({message:e.message});
        }
    }
    static async count(req,res){
        try {
            let {school} = req.params,
                totalBill = await BillModel.count({school});
            return res.status(200).json({totalBill});
        } catch (e) {
            return res.status(400).json({message:e.message, totalBill:null});
        }
    }
    static async findByVA(req,res,next){
        try {
            let {vaNumber} = req.body;
            let bills = await BillModel.find({VANumber:{$regex:vaNumber,$options:'i'}}).populate('school');
            return res.status(200).json(bills);    
        } catch (e) {
            return res.status(400).json({message:e.message});
        }
    }
    static async forceUpdateBill(req,res){
        try {
            let {billId} = req.body;
            let bill = await BillModel.findById({_id:billId});
            if(bill){
                if(bill.payment.status != 'paid'){
                    bill.payment.status='paid';
                    bill.payment.date=Date.now();
                    if(bill.type == 'accommodation'){
                        for (let i = 0; i < bill.accommodation.bookings.length; i++) {
                            let booking = await BookingModel.findByIdAndUpdate({_id:bill.accommodation.bookings[i]},{isPaid:true});
                            // console.log(booking);
                        }
                    }
                    if(bill.type == 'registration'){
                        for (let i = 0; i < bill.registration.teams.length; i++) {
                            await TeamModel.findByIdAndUpdate({_id:bill.registration.teams[i]},{
                                isPaid2:true
                            });
                        }
                        for (let i = 0; i < bill.registration.teachers.length; i++) {
                            await TeacherModel.findByIdAndUpdate({_id:bill.registration.teachers[i]},{
                                isPaid2:true
                            });
                        }
                    }
                    await bill.save();
                    return res.status(200).json({bill,message:"Bill status successfully change"});
                }
                else{
                    throw Error('Bill already paid');
                }
            }
            else{
                throw Error('Bill not found');
            }
        } catch (e) {
            return res.status(400).json({message:e.message});
        }
    }
}

module.exports = BillController;