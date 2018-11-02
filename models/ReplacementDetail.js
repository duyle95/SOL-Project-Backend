const mongoose = require('mongoose');
const { Schema } = mongoose;

const ShiftDetailSchema = new Schema({
    replacer_id: { type: Schema.Types.ObjectId, ref: 'User' },
    shift_type: {
        required: true,
        type: String
    },
    shift_date: {
        type: Date,
        required: true
    }
})

const replacementDetailSchema = new Schema({
    replacee_id: { type: Schema.Types.ObjectId, ref: 'User' },
    status: {
        required: true,
        type: String
    },
    admin_comment: {
        type: String,
        default: ''
    },
    submitted_at: {
        type: Date,
        required: true
    },
    replace_shifts: [ShiftDetailSchema]
})

module.exports = replacementDetailSchema;