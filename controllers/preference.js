const User = require("../models/User");
const PreferenceForm = require("../models/PreferenceForm");

exports.newPreferenceForm = async (req, res, next) => {
  const { preference_detail } = req.body;
  const { id, _company, role } = req.user;

  if (role !== "basic") {
    return res
      .status(401)
      .send({ message: "Only basic can submit new shift preference forms!" });
  }

  if (preference_detail.length !== 7) {
    return res.status(400).send({
      message: "Please submit the correct version of preference form! "
    });
  }

  try {
    const preference_form = new PreferenceForm({
      _company,
      _user: id,
      submitted_at: new Date(),
      preference_detail
    });
    await preference_form.save();

    res.status(200).send({ message: "Submitted success!" });
  } catch (e) {
    res.status(500).send(e);
  }
};

exports.updatePreferenceFormAdmin = async (req, res, next) => {
  const { form_id } = req.params;
  const { status, admin_comment } = req.body;
  const { role } = req.user;

  if (role !== "admin") {
    return res.status(401).send({
      message: "Only admin is allowed to evaluate replacement forms."
    });
  }

  const existing_form = await PreferenceForm.findOne({ _id: form_id });
  if (!existing_form) {
    return res
      .status(422)
      .send({ message: "This shift preference form is not found!" });
  }
  try {
    if (status === "Accepted") {
      await User.findOneAndUpdate(
        { _id: existing_form._user },
        { $set: { shift_preference: existing_form.preference_detail } }
      );
    }

    existing_form.status = status;
    existing_form.admin_comment = admin_comment;
    await existing_form.save();

    return res.status(200).send({ message: "Reply successfully!" });
  } catch (e) {
    return res.status(500).send(e);
  }
};

exports.updatePreferenceFormBasic = async (req, res, next) => {
  const { form_id } = req.params;
  const { preference_detail } = req.body;
  const { role, id } = req.user;

  if (role !== "basic") {
    return res
      .status(401)
      .send({ message: "Only basic can submit new shift preference forms!" });
  }
  const existing_form = await PreferenceForm.findOne({ _id: form_id });
  if (!existing_form) {
    return res.status(422).send({
      message:
        "We can't find any replacement form with this id. Please log out and try again later."
    });
  }

  const { _user } = existing_form;
  if (!_user.equals(id)) {
    return res
      .status(401)
      .send({ message: "You are not the owner of this form!" });
  }

  try {
    existing_form.preference_detail = preference_detail;
    existing_form.admin_comment = "";
    existing_form.status = "Pending";
    await existing_form.save();

    return res.status(200).send({ message: "Update successfully" });
  } catch (e) {
    return res.status(500).send(e);
  }
};

exports.getAllPreferenceForm = async (req, res, next) => {
  const { _company, role } = req.user;

  if (role !== "admin") {
    return res
      .status(401)
      .send("Only admin is allowed to evaluate preference forms.");
  }
  try {
    const preference_forms = await PreferenceForm.find({ _company });
    res.status(200).send(preference_forms);
  } catch (e) {
    res.status(500).send(e);
  }
};

exports.getCurrentPreferenceForm = async (req, res, next) => {
  const { id } = req.user;
  try {
    // const preference_forms = await PreferenceForm.find({
    //   _user: id
    // });
    const preference_forms = await PreferenceForm.find({
      $and: [
        {
          _user: id
        },
        {
          $or: [{ status: "Pending" }, { status: "Change Requested" }]
        }
      ]
    });
    res.status(200).send(preference_forms);
  } catch (e) {
    res.status(500).send(e);
  }
};

exports.getCurrentUserPreferenceDetail = async (req, res, next) => {
  const { id } = req.user;

  try {
    const user = await User.findOne({ _id: id }).select({
      shift_preference: 1
    });

    res.status(200).send(user.shift_preference);
  } catch (e) {
    res.status(500).send(e);
  }
};
