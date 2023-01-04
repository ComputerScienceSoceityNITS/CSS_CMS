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

const ALLOWED_ORIGINS = [
  "http://localhost:3000",
  process.env.CLIENT_URL,
  process.env.ADMIN_URL,
];

// enable CORS
// const corsOptions = {
//   origin: ALLOWED_ORIGINS,
//   methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS", "HEAD"],
//   allowedHeaders: [
//     "Origin",
//     "X-Requested-With",
//     "Content-Type",
//     "Accept",
//     "Authorization",
//   ],
//   credentials: true,
// };

// app.options(ALLOWED_ORIGINS, cors(corsOptions));
// app.use(cors(corsOptions));

app.all("*", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", process.env.ADMIN_URL);
  res.header("Access-Control-Allow-Credentials", true);
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type,Content-Length, Authorization, Accept,X-Requested-With"
  );
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");

  next();
});

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
