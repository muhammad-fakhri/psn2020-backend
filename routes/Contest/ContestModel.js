let mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    bcrypt = require('bcryptjs');

let contestSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    memberPerTeam: {
        type: Number,
        min: 1,
        max: 3,
        default: 0,
        required: true
    },
    maxTeam: {
        type: Number,
        min: 1,
        default: 0,
        required: true
    },
    imgPath: {
        type: String,
        default: null
    },
    pricePerStudent: {
        type: Number,
        min: 0,
        required: true
    },
    registrationStatus: {
        type: String,
        default: "close",
        enum: [
            "open",
            "close"
        ],
        required: true
    },
    registeredTeam: {
        type: Number,
        required: true,
        min: 0,
        default: 0
    }
});

// create a model
let Contest = mongoose.model('Contest', contestSchema);

// export the model
module.exports = Contest;