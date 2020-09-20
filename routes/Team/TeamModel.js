let mongoose = require("mongoose"),
  Schema = mongoose.Schema;

let teamSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  isFinal: {
    type: Boolean,
    default: false,
    required: true,
  },
  isPaid: {
    type: Boolean,
    default: false,
    required: true,
  },
  school: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "School",
  },
  students: [
    {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Student",
    },
  ],
  paymentId: {
    type: String,
    default: null,
  },
  contest: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Contest",
  },
});

// create a model
let Team = mongoose.model("Team", teamSchema);

// export the model
module.exports = Team;
