let mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    bcrypt = require('bcryptjs');

let schoolSchema = new Schema({
    name: {
        type: String,
        minlength: 6,
        maxlength: 50,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    address: {
        type: String
    },
    phone: {
        type: String
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

schoolSchema.methods.isValidPassword = async function (newPassword) {
    try {
        console.log(newPassword, this.password);
        return await bcrypt.compare(newPassword, this.password);
    } catch (error) {
        throw new Error(error);
    }
}

// create a model
let School = mongoose.model('School', schoolSchema);

// export the model
module.exports = School;