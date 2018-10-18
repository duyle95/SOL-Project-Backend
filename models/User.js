const mongoose  = require("mongoose");
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const validator = require("validator");

const { Schema } = mongoose;

const userSchema = new Schema({
    // admin or basic
    role: {
        type: String,
        required: true
    },
    _company: {
        type: Schema.Types.ObjectId,
        ref: "Company"
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function(email) {
                return validator.isEmail(email);
            },
            message: props => `${props.value} is not a valid email`
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    full_name: {
        type: String
    },
    phone_number: {
        type: Number
    }
});

userSchema.pre("save", function(next) {
    var user = this;

    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(user.password, salt, (err, hash) => {
            user.password = hash;
            next();
        });
    });
});

userSchema.methods.comparePassword = function(candidatePassword, callback) {
    bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
        if (err) {
            return callback(err);
        }

        callback(null, isMatch);
    });
}

const User = mongoose.model("User", userSchema);

module.exports = User;