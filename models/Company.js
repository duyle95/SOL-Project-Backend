const mongoose = require("mongoose");
const ReplacementDetailSchema = require('./ReplacementDetail');
const { Schema } = mongoose;

const companySchema = new Schema({
    name: {
        type: String,
        required: true
    },
    country: {
        type: String
    },
    company_code: {
        type: String,
        required: true
    }
    // more data later: email, phone, address, postcode, time_zone
});

const Company = mongoose.model("Company", companySchema);

module.exports = Company;