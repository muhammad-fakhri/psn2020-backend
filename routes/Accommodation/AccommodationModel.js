let mongoose = require('mongoose'),
    Schema = mongoose.Schema;

let accommodationSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    quota: {
        type: Number,
        required: true
    },
    reservedQuota: {
        type: Number,
        required: true,
        default: 0
    },
    pricePerNight: {
        type: Number,
        required: true
    },
    startDate: {
        type: Date
    },
    endDate: {
        type: Date
    }
});

// create a model
let Accommodation = mongoose.model('Accommodation', accommodationSchema);

// export the model
module.exports = Accommodation;