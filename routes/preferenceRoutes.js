const Preference = require("../controllers/preference");
const passport = require("passport");
const passportServices = require("../services/passport");

const requireAuth = passport.authenticate("jwt", { session: false });

module.exports = app => {
  app.get(
    "/api/admin/preference/all",
    requireAuth,
    Preference.getAllPreferenceForm
  );
  app.get(
    "/api/basic/preference",
    requireAuth,
    Preference.getCurrentPreferenceForm
  );
  app.get(
    "/api/basic/preference-detail",
    requireAuth,
    Preference.getCurrentUserPreferenceDetail
  );

  app.post(
    "/api/basic/preference/new",
    requireAuth,
    Preference.newPreferenceForm
  );
  app.post(
    "/api/basic/preference/edit/:form_id",
    requireAuth,
    Preference.updatePreferenceFormBasic
  );
  app.post(
    "/api/admin/preference/edit/:form_id",
    requireAuth,
    Preference.updatePreferenceFormAdmin
  );
};
