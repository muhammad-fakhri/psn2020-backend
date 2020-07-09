let ParamModel = require('./ParamModel');

class ParamController {
    constructor(params) {
        
    }
    static async create(req,res){
        try{
            let {code, name, value} = req.value.body,
                param = await ParamModel.create({code,name,value});
            return res.status(201).json({message:"Success", param});
        }catch(e){
            return res.status(400).json({message:e.message, param:null});
        }
    }
    static async get(req,res){
        try{
            let {code} = req.params,
                param = await ParamModel.findOne({code});
            return res.status(201).json({message:"Success", param});
        }catch(e){
            return res.status(400).json({message:e.message, param});
        }
    }
    static async list(req,res){
        try{
            let params = await ParamModel.find({});
            return res.status(201).json({message:"Success", params});
        }catch(e){
            return res.status(400).json({message:e.message, params});
        }
    }
    static async edit(req,res){
        try{
            let {code, name, value} = req.value.body,
                param = await ParamModel.findOneAndUpdate({code},{name,value});
            return res.status(201).json({message:"Success"});
        }catch(e){
            return res.status(400).json({message:e.message});
        }
    }
    static async delete(req,res){
        try{
            let {code} = req.params,
                param = await ParamModel.findOneAndRemove({code})
            return res.status(201).json({message:"Success"});
        }catch(e){
            return res.status(400).json({message:e.message});
        }
    }
}
module.exports = ParamController;