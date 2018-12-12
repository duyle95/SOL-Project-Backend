const jwt = require("jsonwebtoken");
const faker = require("faker");
const User = require("../models/User");
const Company = require("../models/Company");

const tokenForUser = user => {
  const timestamp = new Date().getTime();
  return jwt.sign({ sub: user.id, iat: timestamp }, process.env.JWT_SECRET);
};

exports.currentUser = (req, res, next) => {
  if (!req.user) {
    return res.send({});
  }

  res.send(req.user);
  // res.status(500).send({ error: "Something went wrong!" });
};

// Some testing here
exports.secret = (req, res, next) => {
  res.send("This is a secret route");
};

exports.signin = async (req, res, next) => {
  // return a jwt, front end keeps jwt in localstorage and user's email and id in redux store for future use
  res.json({ token: tokenForUser(req.user), user: req.user });
};
// TODO: change all res obj from error property to message property
exports.signupBasic = async (req, res, next) => {
  // req.body contains: { email, password, _company, role, company_code }
  const { email, password, company_code, full_name } = req.body.user;
  // check if empty email or password\
  if (!email || !password) {
    return res
      .status(422)
      .send({ error: "You must provide an email address and a password!" });
  }

  // check if company_code is correct
  let company = await Company.findOne({ company_code });
  if (!company) {
    return res
      .status(422)
      .send({ error: "We couldn't find any company with this code!" });
  }

  // check if email is duplicate
  let user = await User.findOne({ email });
  if (user) {
    return res.status(422).send({ error: "Email is in use!" });
  }

  // check if full_name is duplicate
  let existingUser = await User.findOne({ full_name: full_name.toLowerCase() });
  if (existingUser) {
    return res
      .status(422)
      .send({ error: "There is already someone with this name!" });
  }

  // save basic user to database and give them jwt token
  try {
    const user = new User({
      email,
      password,
      _company: company._id,
      role: "basic",
      full_name
    });
    await user.save();
    // res.json({ token: tokenForUser(user), user: req.user });
    res.send({ message: "You have signed up successfully! Please sign in!" });
  } catch (e) {
    res.status(500).send(e);
  }
};

exports.signupAdmin = async (req, res, next) => {
  // req.body contains: { admin, company }
  // admin: { email, password }
  // company: { name, country }
  // adjust req.body
  // auto generate a company code, consists of company first name and a random id (8 letters)
  // plug the code along when create a new company
  const {
    user: { email, password },
    company: { company_name: name }
  } = req.body;
  const company_code = faker.random.alphaNumeric(8);

  if (!email || !password) {
    return res
      .status(422)
      .send({ error: "You must provide an email address and a password!" });
  }

  if (!name) {
    return res
      .status(422)
      .send({ error: "You must provide your company name!" });
  }

  // User.findOne({ email }, (err, existingUser) => {
  //     if (err) {
  //         return next(err);
  //     }

  //     if (existingUser) {
  //         return res.status(422).send({ error: "Email is in use." })
  //     }
  // });

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(422).send({ error: "Email is in use!" });
  }

  const company = new Company({ name, company_code });
  const user = new User({
    email,
    password,
    role: "admin",
    _company: company._id
  });

  try {
    await Promise.all([company.save(), user.save()]);
    // return res.json({ token: tokenForUser(user), user: req.user });
    res.send({ message: "You have signed up successfully! Please sign in!" });
  } catch (e) {
    return res.status(500).send(e);
  }
};
