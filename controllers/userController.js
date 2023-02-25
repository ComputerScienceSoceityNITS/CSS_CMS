const User = require("../models/users");
const Crypto = require("node:crypto");
const jwt = require("jsonwebtoken");

//generate password hash function
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

// signup funtion
const signUp = async (req, res) => {
  try {
    const { name, password, email, scholarID, codeforcesHandle, githubHandle } = req.body;

    if (!name || !email || !password || !scholarID) {
      res.status(401).json({ error: "Please Fill In All The Details" });
      return;
    }

    const existingUser = await User.findOne({
      $or: [{ email, scholarID, codeforcesHandle }],
    });

    if (existingUser) {
      res.status(401).json({
        error: "User With Same Email Or ScholarID or Codeforces Handle already Exists!!!",
      });
      return;
    }

    const encrypted_password = generateHash(password);

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
        httpOnly: true,
      };

      res.status(200).cookie("css_jwt_token", token, options).json({
        success: true,
        user,
        token,
        secure: false,
      });
    } else {
      res.status(401).json({ error: "Invalid Credentials" });
    }
  } catch (e) {
    res.status(401).json({ error: "Something Went Wrong. Please Try Again!!!" });
  }
};

const logout = async (req, res) => {
  try {
    res.clearCookie("css_jwt_token");

    res.status(200).json({
      success: true,
      message: "Logged Out",
    });
  } catch (e) {
    res.status(500).json({ error: "Something Went Wrong" });
  }
};

const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.cookie.split("=")[1];
    const email = await jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ email: email.email });
    req.user = user;
    next();
  } catch (e) {
    console.log(e);
    res.status(401).json({ error: "Please Login!!!" });
  }
};

module.exports = { signUp, login, authenticate, logout };
