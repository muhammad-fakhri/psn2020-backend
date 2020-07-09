let mongoose = require('mongoose'),
    Schema = mongoose.Schema;

let billSchema = new Schema({
    _id:{
        type: Schema.Types.ObjectId,
        required: true
    },
    type: {
        type: String,
        required: true,
        enum:['registration', 'accommodation']
    },
    totalPrice:{
        type: Number,
        required: true,
    },
    VANumber:{ //Bisa dapet atau return dari API BNI eCollection
        type: String,
        // required: true
    },
    createdAt:{ 
        type: Date,
        required: true,
        default: Date.now
    },
    payment:{
        status:{
            type: String,
            required: true,
            enum:['waiting', 'paid']
        },
        date:{
            type: Date,
        }
    },
    school:{ //harus populate
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'School'
    },
    registration:{
        teams:[{
            type: Schema.Types.ObjectId,
            ref: 'Team'
        }],
        numberOfStudent:{
            type: Number,
            // required: true
        },
        teachers:[{
            type: Schema.Types.ObjectId,
            ref: 'Teacher'
        }],
        numberOfTeacher:{
            type: Number,
            // required: true
        }
    },
    accommodation:{
        teachers:[{
            type: Schema.Types.ObjectId,
            ref: 'Teacher'
        }],
        students:[{
            type: Schema.Types.ObjectId,
            ref: 'Student'
        }],
        bookings:[{
            type: Schema.Types.ObjectId,
            ref: 'Booking'
        }],
    }
});

// create a model
let Bill = mongoose.model('Bill', billSchema);

// export the model
module.exports = Bill;