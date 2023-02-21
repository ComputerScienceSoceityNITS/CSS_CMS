const User = require("../models/users");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

// signup funtion
const signUp = async (req, res) => {
  try {
    const { name, password, email, scholarID, codeforcesHandle, githubHandle } = req.body;

    if (!name || !email || !password || !scholarID) {
      res.status(401).json({ error: "Please Fill In All The Details" });
      return;
    }

    const encrypted_password = CryptoJS.AES.encrypt(password, process.env.CRYPTOJS_SECRET).toString();

    const existingUser = await User.findOne({
      $or: [{ email, scholarID, codeforcesHandle }],
    });

    if (existingUser) {
      res.status(401).json({
        error: "User With Same Email Or ScholarID or Codeforces Handle already Exists!!!",
      });
      return;
    }

    const user = await User({
      name,
      email,
      password: encrypted_password,
      scholarID,
      codeforcesHandle: codeforcesHandle || null,
      githubHandle: githubHandle || null,
    }).save();

    res.status(201).json({ success: "true" });
  } catch (e) {
    console.log(e);
    res.status(401).json({ error: "Something Went Wrong. Please Try Again!!!" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(401).json({ error: "Please Fill in All the Details!!!" });
      return;
    }

    const user = await User.findOne({ email });

    if (!user) {
      res.status(401).json({ error: "No Such User!!!" });
      return;
    }

    if (CryptoJS.AES.decrypt(user?.password, process.env.CRYPTOJS_SECRET).toString(CryptoJS.enc.Utf8) == password) {
      const token = jwt.sign(
        {
          email: email,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "90d",
        }
      );
      res.status(200).json({ token: token, success: "true" });
    } else {
      res.status(401).json({ error: "Invalid Credentials" });
    }
  } catch (e) {
    res.status(401).json({ error: "Something Went Wrong. Please Try Again!!!" });
  }
};

const authenticate = async (req, res, next) => {
  try {
    const email = await jwt.verify(req.body.email, process.env.JWT_SECRET);
    const user = await User.findOne({ email });
    req.user = user;
    next();
  } catch (e) {
    res.status(401).json({ error: "Please Login!!!" });
  }
};

module.exports = { signUp, login, authenticate };
