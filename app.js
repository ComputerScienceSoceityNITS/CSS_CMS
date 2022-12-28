const express = require('express');
const fileUpload = require("express-fileupload");
const cookieparser = require("cookie-parser");
const bodyParser = require("body-parser");
const app = express();

//config
if(process.env.NODE_ENV!=="PRODUCTION"){
    require("dotenv").config({ path: "./config/.env" });
}

// Enable CORS
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", process.env.ORIGIN_URL);
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-Credentials", true);
    next();
})


app.use(cookieparser())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(fileUpload({useTempFiles:true}))

const members = require("./routes/membersRoute.js");
const events = require("./routes/eventsRoute.js");
const admin = require("./routes/adminRoute.js");

app.use("/api/admin", members);
app.use("/api/admin", events);
app.use("/api/admin", admin);

module.exports = app;