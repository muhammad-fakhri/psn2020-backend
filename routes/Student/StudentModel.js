let mongoose = require('mongoose'),
    Schema = mongoose.Schema;

let studentSchema = new Schema({
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
    school:{
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'School'
    },
    team:{
        type: Schema.Types.ObjectId,
        ref: 'Team',
        default: null
    },
    accommodationBooking:{
        type: Boolean,
        default: false
    },
    accommodationBookingId:{
        type: Schema.Types.ObjectId,
        ref: 'Booking',
        default: null
    }
});

// create a model
let Student = mongoose.model('Student', studentSchema);

// export the model
module.exports = Student;