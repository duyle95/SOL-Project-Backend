const Replace = require("../controllers/replacement");
const passport = require("passport");
const passportServices = require("../services/passport");

const requireAuth = passport.authenticate("jwt", { session: false });

module.exports = app => {
    app.get('/api/basic/all', requireAuth, Replace.getAllBasic);
    app.post('/api/basic/replacement/new', requireAuth, Replace.newForm);
}