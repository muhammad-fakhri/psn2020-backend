let mongoose = require('mongoose'),
    Schema = mongoose.Schema;

let paramSchema = new Schema({
    code: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    value: {
        type: String,
        required: true
    },
});

// create a model
let Param = mongoose.model('Param', paramSchema);

// export the model
module.exports = Param;