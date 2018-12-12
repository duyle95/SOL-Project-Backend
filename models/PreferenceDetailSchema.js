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

module.exports = preferenceDetailSchema;
