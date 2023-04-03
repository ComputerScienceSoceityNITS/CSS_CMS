const User = require("../models/users");
const Crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { catchAsync, AppError } = require("../utils/errorHandler");
const sendEmail = require("../utils/email");
const { getCookie } = require("../utils/getCookie");

const getUser = (req, res) => {
  try {
    res.status(201).json({
      status: "success",
      user: req.user,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.name,
    });
  }
};

const generateHash = (password, salt = null) => {
  if (salt == null) {
    const salt = Crypto.randomBytes(16).toString("hex");
    const hash = Crypto.scryptSync(password, salt, 64).toString("hex") + "$" + salt;
    return hash;
  } else {
    const hash = Crypto.scryptSync(password, salt, 64).toString("hex");
    return hash;
  }
};

const signUp = catchAsync(async (req, res, next) => {
  const { name, password, email, scholarID, codeforcesHandle, githubHandle } = req.body;

  if (!name || !email || !password || !scholarID) {
    return res.status(401).json({
      status: "fail",
      message: "please fill in all the details",
    });
  }

  const query = User.findOne();
  query.or([
    { email: email.toLowerCase() },
    { scholarID: scholarID },
    {
      codeforcesHandle: codeforcesHandle?.toLowerCase() || "nonexistentcfhandle",
    },
  ]);
  const existingUser = await query;

  if (existingUser) {
    return res.status(401).json({
      status: "fail",
      message: "user with same email / scholarID / codeforces handle already exists",
    });
  }

  const encrypted_password = generateHash(password);

  const user = await User({
    name,
    email,
    password: encrypted_password,
    scholarID,
    codeforcesHandle: codeforcesHandle,
    githubHandle: githubHandle,
  }).save();

  res.status(201).json({
    status: "success",
    user: {
      name: user.name,
      email: user.email,
      scholarID: user.scholarID,
      githubHandle: user.githubHandle,
      codeforcesHandle: user.codeforcesHandle,
    },
  });
});

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      status: "fail",
      message: "please fill in all the required details",
    });
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return res.status(400).json({
      status: "fail",
      message: "user not found",
    });
  }

  const hashedPassword = user.password;
  const [hash, salt] = hashedPassword.split("$");

  const givenPassword = req.body.password;
  const givenHash = generateHash(givenPassword, salt);

  if (givenHash == hash) {
    const token = jwt.sign(
      {
        email: email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    const options = {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      domain: "css-cms.onrender.com",
      httpOnly: true,
      secure: true,
      sameSite: "none",
    };

    user.password = undefined;
    res.status(200).cookie("css_jwt_token", token, options).json({
      status: "success",
      message: "user successfully signed in",
      token: token,
      user: user,
    });
  } else {
    res.status(400).json({
      status: "fail",
      message: "invalid credentials",
    });
  }
});

const logout = catchAsync(async (req, res, next) => {
  res.clearCookie("css_jwt_token");
  res.status(200).json({
    status: "success",
    message: "user successfully logged out",
  });
});

const resetPassword = catchAsync(async (req, res, next) => {
  const email = req.body.email;
  if (!email) {
    return next(new AppError("Email id field cannot be empty", 400));
  }
  const user = await User.findOne({ email: email });
  if (!user) {
    return next(new AppError("No user with the given email id found", 404));
  }
  const newPassword = Crypto.randomBytes(4).toString("hex");
  const hashedPassword = generateHash(newPassword);
  user.password = hashedPassword;

  const message = `Your password for nitscss.live has been updated. Your new password is ${newPassword}.`;

  try {
    await sendEmail({
      to: user.email,
      subject: "Nitscss.live Password Reset",
      message: message,
    });
  } catch (err) {
    console.log({ err });
    return next(new AppError("Password reset failed", 500));
  }

  await user.save();
  return res.status(200).json({
    status: "success",
    message: "New password sent to registered email id",
  });
});

const updateProfile = catchAsync(async (req, res, next) => {
  const { name, email, scholarID, codeforcesHandle, githubHandle, password } = req.body;

  const updatedData = {
    name: name || req.user.name,
    email: email || req.user.email,
    scholarID: scholarID || req.user.scholarID,
    codeforcesHandle: codeforcesHandle || req.user.codeforcesHandle,
    githubHandle: githubHandle || req.user.githubHandle,
  };

  if (password) {
    const hashedPassword = generateHash(password);
    updatedData.password = hashedPassword;
  }

  const updatedUser = req.user;
  Object.assign(updatedUser, updatedData);
  await updatedUser.save();

  return res.status(200).json({
    status: "success",
    message: "profile updated successfully",
  });
});

const authenticate = catchAsync(async (req, _res, next) => {
  const token = req.cookies?.css_jwt_token;
  if (!token) {
    return next(new AppError("No auth token found...check if third party cookies are allowed in site settings.", 401));
  }

  const email = await jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findOne({ email: email.email });

  req.user = user;
  next();
});

module.exports = { signUp, login, logout, authenticate, getUser, updateProfile, resetPassword };
