let mongoose = require('mongoose'),
    Schema = mongoose.Schema;

let bookingSchema = new Schema({
    school: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'School'
    },
    userType: {
        type: String,
        enum: ['student', 'teacher'],
        required: true
    },
    student:{
        type: Schema.Types.ObjectId,
        ref: 'Student'
    },
    teacher:{
        type: Schema.Types.ObjectId,
        ref: 'Teacher'
    },
    accommodation:{
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Accommodation'
    },
    isFinal:{
        type: Boolean,
        default: false
    },
    isPaid:{ //untuk sementara kayanya ga bakal ada tujuannya, tapi buat jaga-jaga ada aja
        type: Boolean,
        default: false
    },
    duration:{
        type: Number,
        default: 1,
        required: true
    },
    startDate:{
        type: Date,
        required: true
    }
});

// create a model
let Booking = mongoose.model('Booking', bookingSchema);

// export the model
module.exports = Booking;