const User = require("../models/User");
const ReplacementForm = require("../models/ReplacementForm");

exports.updateReplacementFormBasic = async (req, res, next) => {
    // update the detail of a specific form: with form id, replacee(owner)_id
    // basic can update replacer_id if required, also update updated_at
    // replace_shifts: [ { shift_id, replacer_id } ]
    const { replace_shifts, shift_type } = req.body;
    const { role, id } = req.user;
    const {form_id} = req.params;
    if (role !== 'basic') {
        return res.status(401).send({ message: "Only basic is allowed to resubmit his/her own replacement forms." });
    }
    const replacement_form = await ReplacementForm.findOne({ _id: form_id });
    if (!replacement_form) {
        return res.status(422).send({ message: "We can't find any replacement form with this id. Please log out and try again later." });
    }
    
    const { replacee_id } = replacement_form;
    if (!replacee_id.equals(id)) {
        return res.status(401).send({ message: "You are not the owner of this replacement form!"});
    }

    try {
        replacement_form.shift_type = shift_type;
        replacement_form.replace_shifts = replace_shifts;
        replacement_form.status = 'Pending';
        await replacement_form.save();

        return res.status(200).send({ message: "Update successfully" });
    } catch(e) {
        return res.status(500).send(e);
    }
}

exports.updateReplacementFormAdmin = async (req, res, next) => {
    // for admin to update the status and admin_comment from form_id, 
    // form_id, status, admin_comment
    const { form_id } = req.params;
    const { status, admin_comment } = req.body;
    const { role } = req.user;
    if (role !== 'admin') {
        return res.status(401).send({ message: "Only admin is allowed to evaluate replacement forms."});
    }

    const existing_form = await ReplacementForm.findOne({ _id: form_id });
        if (!existing_form) {
            return res.status(422).send({ message: "This replacement form's id is not found." })
        }

    try {
        existing_form.status = status;
        existing_form.admin_comment = admin_comment;
        await existing_form.save()

        return res.status(200).send({ message: "Reply successfully!" });
    } catch(e) {
        return res.status(500).send(e);
    }

}

exports.newReplacementForm = async (req, res, next) => {
    const { replace_shifts, shift_type } = req.body;
    const { id: replacee_id, _company } = req.user;
    // find the company from the id
    // add new document to the subdocuments array
    if (!replace_shifts || replace_shifts.length === 0) {
        return res.status(422).send({ message: "You need to provide at least one shift to replace." });
    }

    try {
        const replacement_form = new ReplacementForm({ replacee_id, _company, submitted_at: new Date(), replace_shifts, shift_type });
        await replacement_form.save();
        
        res.status(200).send({ message: "Submitted success!" });
    } catch(e) {
        res.status(500).send(e);
    }
}

exports.getAllReplacementForm = async (req, res, next) => {
    const { _company, role } = req.user;

    if (role !== 'admin') {
        return res.status(401).send("Only admin is allowed to evaluate to replacement forms.");
    }

    try {
        const replace_shifts = await ReplacementForm.find({ _company });

        res.status(200).send(replace_shifts);
    } catch (e) {
        res.status(500).send(e);
    }
}

exports.getUserReplacementForm = async (req, res, next) => {
    const { id } = req.user;
    try {
        const replace_shifts = await ReplacementForm.find({ replacee_id: id });
        res.status(200).send(replace_shifts);
    } catch (e) {
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