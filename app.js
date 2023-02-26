const express = require("express");
const fileUpload = require("express-fileupload");
const cookieparser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const xss = require("xss-clean");
const mongoSanitize = require("express-mongo-sanitize");
const app = express();

//config
if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({ path: "./config/.env" });
}

app.use(cookieparser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(fileUpload({ useTempFiles: true }));

// enable cors
const ALLOWED_ORIGINS = ["http://localhost:3000", process.env.CLIENT_URL, process.env.ADMIN_URL];

app.use(cors({ origin: ALLOWED_ORIGINS, credentials: true }));

app.use((req, res, next) => {
  const { origin } = req.headers;
  const theOrigin = ALLOWED_ORIGINS.indexOf(origin) >= 0 ? origin : ALLOWED_ORIGINS[0];
  res.header("Access-Control-Allow-Origin", theOrigin);
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, HEAD");
  next();
});

app.options("*", cors());

// set security HTTP headers
app.use(helmet());

// sanitize request data
app.use(xss());
app.use(mongoSanitize());

const members = require("./routes/membersRoute.js");
const admin = require("./routes/adminRoute.js");

app.use("/api/admin", members);
app.use("/api/admin", admin);

//routes for general users
const userRoute = require("./routes/userRoutes.js");
const abacusRoute = require("./routes/abacusRoute.js");
const enigmaRoute = require("./routes/enigmaRoute");

app.use("/user", userRoute);
app.use("/abacus", abacusRoute);
app.use("/enigma", enigmaRoute);
module.exports = app;
