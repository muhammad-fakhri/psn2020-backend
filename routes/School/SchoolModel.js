let mongoose = require('mongoose'),
    Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

let schoolSchema = new Schema({
    name: {
        type: String,
        minlength: 6,
        maxlength: 50,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    address: {
        type: String
    },
    phone: {
        type: String
    },
    province: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    resetPasswordToken: {
        type: String
    },
    verifyEmailToken: {
        type: String
    },
    isVerifiedEmail: {
        type: Boolean,
        default: false,
        required: true
    },
    changeEmailToken: {
        type: String
    },
    verifyEmailDate: {
        type: Date
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now()
    },
    updatedAt: {
        type: Date,
        required: true,
        default: Date.now()
    }
});

schoolSchema.pre('save', async function (next) {
    try {
        this.updatedAt = Date.now();
        next();
    } catch (error) {
        next(error);
    }
});

schoolSchema.methods.isValidPassword = async function (newPassword) {
    try {
        return await bcrypt.compare(newPassword, this.password);
    } catch (error) {
        throw new Error(error);
    }
}

// create a model
let School = mongoose.model('School', schoolSchema);

// export the model
module.exports = School;