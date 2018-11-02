const User = require("../models/User");
const ReplacementDetailSchema = require('../models/ReplacementDetail');
const Company = require("../models/Company");

exports.newForm = async (req, res, next) => {
    const { replace_shifts } = req.body;
    const { id: replacee_id, _company } = req.user;
    // find the company from the id
    // add new document to the subdocuments array
    if (!replace_shifts || replace_shifts.length === 0) {
        return res.status(422).send("You need to provide at least one shift to replace.")
    }
    // console.log(replace_shifts);
    // console.log(req.user);
    try {
        await Company.updateOne(
            { _id: _company },
            { $push: { shift_replacement: { replacee_id, status: 'Pending', submitted_at: new Date(), replace_shifts} } }    
        )
        res.status(200).send(req.user);
    } catch(e) {
        res.status(500).send(e);
    }
}

exports.getAllBasic = async (req, res, next) => {
    const { _company, id } = req.user;
    try {
        const basic_users = await User.find({ _company, _id: { $ne: id }, role: "basic" }).select({ "full_name": 1 });

        res.send(basic_users);
    } catch(e) {
        res.status(500).send(e);
    }
}