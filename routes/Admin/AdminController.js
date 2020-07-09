let AdminModel = require('./AdminModel');

class AdminController {
    constructor(params) {
        
    }
    static async create(name, username, email, password){
        try{
            return await AdminModel.create({name, username, email, password});
        }catch(e){
            throw e;
        }

    }
    static async login(username,password){
        let admin = await AdminModel.findOne({username});
        if(admin==null)
            return {status: 404, admin: null, message:"Username not found."}
        let isMatch = await admin.isValidPassword(password);
        if(isMatch){
            return {status: 200, admin, message:"Success"}
        }
        else{
            return {status: 400, admin:null, message:"Wrong password."}
        }
    }
}

module.exports = AdminController;