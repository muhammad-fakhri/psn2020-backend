let ContestModel = require('./ContestModel');
let TeamModel = require('../Team/TeamModel');

class ContestController {
    constructor(params) {
        
    }
    static async create(req,res){
        let {privilege} = req.decoded;
        console.log(req.decoded)
        if(privilege != 'admin')
            return res.status(401).json({message: "Not allowed.", contest:null});
        try{
            let {name, memberPerTeam, maxTeam, img, pricePerStudent, registrationStatus} = req.value.body,
                contest = await ContestModel.create({name, memberPerTeam, maxTeam, img, pricePerStudent, registrationStatus});
            return res.status(201).json({message: "Success.", contest});
        }catch(e){
            return res.status(500).json({message:e.message, contest:null})
        }
    }
    static async list(req,res){
        try{
            let {registrationStatus} = req.query,
                condition = (registrationStatus?{registrationStatus}:{}),
                data = await ContestModel.find(condition),
                contests = [];
            for (let i = 0; i < data.length; i++) {
                let contest = data[i].toObject();
                contest.registeredTeam = await TeamModel.find({contest:contest._id}).count();
                contests.push(contest);
            }
            // console.log(condition,registrationStatus);
            return res.status(200).json({message:"Success.",contests});
        }catch(e){
            return res.status(500).json({message:e.message, contests:null})
        }
    }
    static async edit(req,res){
        let {privilege} = req.decoded;
        if(privilege != 'admin')
            return res.status(401).json({message: "Not allowed.", contest:null});
        try{
            let {_id, name, memberPerTeam, maxTeam, img, pricePerStundent, registrationStatus} = req.value.body;
            await ContestModel.findByIdAndUpdate({_id},{name,memberPerTeam,maxTeam,img,pricePerStundent,registrationStatus});
            return res.status(200).json({message:"Success"});
        }catch(e){
            return res.status(500).json({message:"Failed"});
        }
    }
    static async delete(req,res){
        let {privilege} = req.decoded;
        if(privilege != 'admin')
            return res.status(401).json({message: "Not allowed.", contest:null});
        try{
            let {_id} = req.params,
                contest = await ContestModel.findByIdAndDelete({_id});
            return res.status(200).json({message:"Success",contest});
        }catch(e){
            return res.status(500).json({message:"Failed",contest:null});
        }
    }
}

module.exports = ContestController;