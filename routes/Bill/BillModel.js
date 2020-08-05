let mongoose = require('mongoose'),
    Schema = mongoose.Schema;

let billSchema = new Schema({
    totalPrice: {
        type: Number,
        default: 0,
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
        ref: 'Team',
        required: true
    }],
    status: {
        type: String,
        enum: [
            "pending",
            "paid"
        ],
        required: true
    },
    createdDate: {
        type: Date,
        required: true,
        default: Date.now()
    },
    paidDate: {
        type: Date,
        required: true
    }
});

// create a model
let Bill = mongoose.model('Bill', billSchema);

// export the model
module.exports = Bill;