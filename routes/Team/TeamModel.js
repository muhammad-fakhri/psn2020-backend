let mongoose = require('mongoose'),
    Schema = mongoose.Schema;

let teamSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    contest:{
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Contest'
    },
    school:{
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'School'
    },
    student:[{
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Student'
    }],
    isPaid:{
        type: Boolean,
        default: false,
    },
    isPaid2:{
        type: Boolean,
        default: false,
    },
});

// create a model
let Team = mongoose.model('Team', teamSchema);

// export the model
module.exports = Team;