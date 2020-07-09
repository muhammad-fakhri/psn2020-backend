let mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    bcrypt = require('bcryptjs');

let contestSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    memberPerTeam:{
        type: Number,
        required: true
    },
    maxTeam:{
        type: Number,
        required: true
    },
    img:{
        type: String,
        required: true
    },
    pricePerStudent:{
        type: Number,
        required: true
    },
    registrationStatus:{
        type: String,
        enum: ['open', 'close'],
        default: 'open'
    }
});

// create a model
let Contest = mongoose.model('Contest', contestSchema);

// export the model
module.exports = Contest;