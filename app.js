const express = require('express');
const fileUpload = require("express-fileupload");
const cookieparser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();

//config
if(process.env.NODE_ENV!=="PRODUCTION"){
    require("dotenv").config({ path: "./config/.env" });
}

app.use(cookieparser())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(bodyParser.urlencoded({ extended: false }))

// enable CORS
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
})

app.use(cors());

app.use(fileUpload({useTempFiles:true}))

const members = require("./routes/membersRoute.js");
const events = require("./routes/eventsRoute.js");
const admin = require("./routes/adminRoute.js");

app.use("/api/admin", members);
app.use("/api/admin", events);
app.use("/api/admin", admin);

module.exports = app;
