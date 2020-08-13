let mongoose = require('mongoose'),
    Schema = mongoose.Schema;

let schoolNameSchema = new Schema({
    name: {
        type: String
    }
});

let SchoolName = mongoose.model('SchoolName', schoolNameSchema);

// export the model
module.exports = SchoolName;