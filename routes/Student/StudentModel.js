let mongoose = require('mongoose'),
    Schema = mongoose.Schema;

let studentSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        enum: [
            "male",
            "female"
        ],
        required: true
    },
    school: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'School'
    },
    team: {
        type: Schema.Types.ObjectId,
        default: null,
        ref: 'Team'
    }
});

// create a model
let Student = mongoose.model('Student', studentSchema);

// export the model
module.exports = Student;