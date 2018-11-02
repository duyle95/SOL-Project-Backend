require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');

require("./services/passport");

const app = express();
const port = process.env.PORT || 5000;

mongoose.Promise = global.Promise;
mongoose.set('useCreateIndex', true);
mongoose.connect(
    process.env.MONGO_URI,
    { useNewUrlParser: true },
    err => {
        console.error(err);
    }
);

app.use(bodyParser.json());
app.use(cors());

app.get("/", (req, res) => {
    res.send("Hello from the other side");
});

app.use(passport.initialize());
require("./routes/authRoutes")(app);
require('./routes/replacementRoutes')(app);

app.listen(port, () => {
    console.log("Listening on port " + port);
})