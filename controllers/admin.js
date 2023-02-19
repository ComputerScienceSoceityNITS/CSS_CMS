const Admin = require("../models/admin"); //schema
const jwt = require("jsonwebtoken");

// No need to call this function, offical admin is already created
exports.addAdmin = async (req, res) => {
  try {
    // console.log(req.body);
    const admin = await Admin.create(req.body);
    res.status(201).json({
      success: true,
      admin,
    });
    sendToken(admin, 201, res);
  } catch (err) {
    res.send(err.message);
  }
};

exports.isAuthenticatedUser = async (req, res, next) => {
  try {
    const { CSS_Website } = req.cookies;

    if (!CSS_Website) {
      return res.status(401).json({
        success: false,
        message: "Please login to access this Resource",
      });
    }

    const decodedData = jwt.verify(CSS_Website, process.env.JWT_SECRET);
    req.user = await Admin.findById(decodedData.id);
    next();
  } catch (err) {
    res.send(err.message);
  }
};

//login
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    //checkng if user has entered both email and password
    if (!email || !password) {
      return res.status(500).json({
        success: false,
        message: "Please Enter Email and Password",
      });
    }

    const admin = await Admin.findOne({ role: "admin" }).select("+password");
    if (admin.email !== email || admin.password !== password) {
      return res.status(401).json({
        success: false,
        message: "Invalid Enter Email or Password",
      });
    }
    sendToken(admin, 201, res);
  } catch (err) {
    res.send(err.message);
  }
};

//logout user
exports.logout = async (req, res, next) => {
  try {
    res.cookie("CSS_Website", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    });
    res.status(200).json({
      success: true,
      message: "Logged Out",
    });
  } catch (err) {
    res.send(err.message);
  }
};

sendToken = (user, ststusCode, res) => {
  const token = user.getJWTToken();

  //options for cookie
  const options = {
    expires: new Date(Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
    httpOnly: false,
  };

  console.log(token);

  res.status(ststusCode).cookie("CSS_Website", token, options).json({
    success: true,
    user,
    token,
  });
};
