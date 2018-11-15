const Replace = require("../controllers/replacement");
const passport = require("passport");
const passportServices = require("../services/passport");

const requireAuth = passport.authenticate("jwt", { session: false });
// NOTE: consider naming conventions and REST api design best practice
module.exports = app => {
    app.get('/api/basic/all', requireAuth, Replace.getAllBasic);
    app.get('/api/basic/replacement/all', requireAuth, Replace.getUserReplacementForm)
    app.post('/api/basic/replacement/new', requireAuth, Replace.newReplacementForm);
    app.get('/api/admin/replacement/all', requireAuth, Replace.getAllReplacementForm);

    app.post('/api/basic/replacement/edit/:form_id', requireAuth, Replace.updateReplacementFormBasic);
    app.post('/api/admin/replacement/edit/:form_id', requireAuth, Replace.updateReplacementFormAdmin);
}