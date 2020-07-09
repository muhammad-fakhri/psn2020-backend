let mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    bcrypt = require('bcryptjs');

let adminSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    }
});

adminSchema.pre('save', async function (next) {
    if (this.password) {
        try {
            // Generate a salt
            const salt = await bcrypt.genSalt(10);
            // Generate a password hash (salt + hash)
            const passwordHash = await bcrypt.hash(this.password, salt);
            // Re-assign hashed version over original, plain text password
            this.password = passwordHash;
            next();
        } catch (error) {
            next(error);
        }
    }
    next();
});

adminSchema.methods.isValidPassword = async function (newPassword) {
    try {
        console.log(newPassword,this.password);
        return await bcrypt.compare(newPassword, this.password);
    } catch (error) {
        throw new Error(error);
    }
}

// create a model
let Admin = mongoose.model('Admin', adminSchema);

// export the model
module.exports = Admin;