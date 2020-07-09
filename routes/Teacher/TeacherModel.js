let mongoose = require('mongoose'),
    Schema = mongoose.Schema;

let teacherSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    phone:{
        type: String,
        required: true
    },
    NIP:{
        type: String,
        required: true
    },
    school:{
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'School'
    },
    isPaid:{
        type: Boolean,
        default: false
    },
    isPaid2:{
        type: Boolean,
        default: false
    },
    accommodationBooking:{
        type: Boolean,
        default: false
    },
    accommodationBookingId:{
        type: Schema.Types.ObjectId,
        ref: 'Booking'
    }
});

// create a model
let Teacher = mongoose.model('Teacher', teacherSchema);

// export the model
module.exports = Teacher;