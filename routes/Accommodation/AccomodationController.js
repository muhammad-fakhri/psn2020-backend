let AccommodationModel = require('./AccommodationModel'),
    express = require('express'),
    BookingModel = require('../Booking/BookingModel');

class AccommodationController {
    static async create(req,res,next){
        try{
            let {name, quota, pricePerNight, startDate, endDate} = req.value.body,
                accommodation = await AccommodationModel.create({name, quota, pricePerNight, startDate, endDate});
            return res.status(201).json({accommodation});
            
        }catch(e){
            return res.status(400).json({accommodation:null, message:e.message});
        }
    }
    static async list(req,res){
        try{
            let accommodations = await AccommodationModel.find({}).lean();
            // console.log(accommodations);
            for (let i = 0; i < accommodations.length; i++) {
                // const element = array[i];
                accommodations[i].bookingAmount = await BookingModel.count({accommodation:accommodations[i]._id});
            }
            return res.status(200).json({accommodations});
        }catch(e){
            return res.status(400).json({accommodations:null, message: e.message});
        }
    }
    static async edit(req,res,next){
        try{
            let {_id, name, quota, pricePerNight, startDate, endDate} = req.value.body;
            let update = {};
            (name!=null?update.name=name:update);
            (quota!=null?update.quota=quota:update);
            (pricePerNight!=null?update.pricePerNight=pricePerNight:update);
            (startDate!=null?update.startDate=startDate:update);
            (endDate!=null?update.endDate=endDate:update);
            // (remainingQuota==null?update.remainingQuota=remainingQuota:update);
            // console.log(update);
            let accommodation = await AccommodationModel.findByIdAndUpdate({_id},update);
            return res.status(200).json({message:"success"});
        }catch(e){
            return res.status(400).json({message: e.message});
        }
    }
    static async delete(req,res,next){
        try{
            let {_id} = req.params,
                accommodation = await AccommodationModel.deleteOne({_id});
            return res.status(200).json({message: "Success"});
        }catch(e){
            return res.status(400).json({message: "Failed"});
        }
    }
    // static async count(req,res){
    //     try {
    //         let {accommodation} = req.params,
    //             bookingAmount = await BookingModel.count({accommodation});
    //         return res.status(200).json({bookingAmount});
    //     } catch (e) {
    //         return res.status(400).json({message:e.message});
    //     }
    // }
}

module.exports = AccommodationController;