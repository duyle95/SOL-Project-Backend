const mongoose = require("mongoose");
const { Schema } = mongoose;

const preferenceDetailSchema = new Schema({
  date: Number,
  morning: {
    type: Boolean,
    default: false
  },
  evening: {
    type: Boolean,
    default: false
  }
});

const preferenceFormSchema = new Schema({
  _company: { type: Schema.Types.ObjectId, ref: "Company" },
  _user: { type: Schema.Types.ObjectId, ref: "User" },
  status: {
    type: String,
    default: "Pending"
  },
  admin_comment: {
    type: String,
    default: ""
  },
  submitted_at: {
    type: Date,
    required: true
  },
  preference_detail: [preferenceDetailSchema]
});

module.exports = mongoose.model("PreferenceForm", preferenceFormSchema);
