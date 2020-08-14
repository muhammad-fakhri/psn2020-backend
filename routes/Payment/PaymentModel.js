let mongoose = require('mongoose'),
    Schema = mongoose.Schema;

let paymentSchema = new Schema({
    _id: {
        type: Schema.Types.ObjectId,
        required: true
    },
    totalPrice: {
        type: Number,
        min: 0,
        required: true
    },
    VANumber: {
        type: String,
        required: true
    },
    school: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'School'
    },
    teams: [{
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Team'
    }],
    status: {
        type: String,
        enum: [
            "waiting",
            "paid"
        ],
        default: 'waiting',
        required: true
    },
    paymentReceipt: {
        type: String,
        default: null
    },
    createdDate: {
        type: Date,
        default: Date.now(),
        required: true
    },
    paidDate: {
        type: Date,
        default: null
    }
});

// create a model
let Payment = mongoose.model('Payment', paymentSchema);

// export the model
module.exports = Payment;