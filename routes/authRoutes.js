const Auth = require("../controllers/auth");
const passport = require("passport");
const passportServices = require("../services/passport");

const requireSignin = passport.authenticate("local", { session: false });
const requireAuth = passport.authenticate("jwt", { session: false });

module.exports = app => {
    app.post('/api/admin/signup', Auth.signupAdmin);
    app.post('/api/basic/signup', Auth.signupBasic);
    app.post("/api/signin", requireSignin, Auth.signin);
    app.get("/api/current_user", requireAuth, Auth.currentUser);
}