const mongoose = require('mongoose');
const { Schema } = mongoose;

const ShiftDetailSchema = new Schema({
    replacer_id: { type: Schema.Types.ObjectId, ref: 'User' },
    replacer_name: {
        type: String
    },
    shift_date: {
        type: Date,
        required: true
    }
})

const replacementDetailSchema = new Schema({
    _company: { type: Schema.Types.ObjectId, ref: 'Company' },
    replacee_id: { type: Schema.Types.ObjectId, ref: 'User' },
    shift_type: {
        required: true,
        type: String
    },
    status: {
        type: String,
        default: 'Pending'
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

const ReplacementForm = mongoose.model("ReplacementForm", replacementDetailSchema);

module.exports = ReplacementForm;