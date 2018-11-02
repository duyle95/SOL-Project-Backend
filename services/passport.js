const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const LocalStrategy = require("passport-local");
const User = require("../models/User");

const localOptions = { usernameField: "email" };
const localLogin = new LocalStrategy(localOptions, (email, password, done) => {
    User.findOne({ email }, (err, user) => {
        if (err) {
            return done(err);
        }

        if (!user) {
            return done(null, false);
        }

        user.comparePassword(password, (err, isMatch) => {
            if (err) {
                return done(err);
            }

            if (!isMatch) {
                return done(null, false);
            }
            
            return done(null, { email: user.email, id: user._id, role: user.role, _company: user._company });
        });
    });
});

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromHeader("authorization"),
    secretOrKey: process.env.JWT_SECRET
};

const jwtLogin = new JwtStrategy(jwtOptions, (payload, done) => {
    User.findById(payload.sub, (err, user) => {
        if (!user) {
            return done(err, false);
        }
        
        if (user) {
            return done(null, { email: user.email, id: user._id, role: user.role, _company: user._company });
        } else {
            return done(null, false);
        }
    });
});
passport.use(localLogin);
passport.use(jwtLogin);