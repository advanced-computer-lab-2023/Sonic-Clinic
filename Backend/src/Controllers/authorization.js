const { default: mongoose } = require("mongoose");
const administratorModel = require("../Models/Adminstrator.js");
const DoctorModel = require("../Models/Doctor.js");
const patientModel = require("../Models/Patient.js");
const jwt = require("jsonwebtoken");
const maxAge = 3 * 24 * 6 * 60;
const bcrypt = require("bcrypt");

const createToken = (id) => {
  return jwt.sign({ id }, "secret-unkown", {
    expiresIn: maxAge,
  });
};

const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const doctor1 = await DoctorModel.findOne({ username });
    const patient1 = await patientModel.findOne({ username });
    const admin1 = await administratorModel.findOne({ username });

    if (doctor1) {
      const auth = bcrypt.compare(password, doctor1.password);
      if (auth) {
        const token = createToken(doctor1._id);
        res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge } * 1000);
        return res.status(200).json({ message: "Doctor", user: doctor1 });
      }
      throw Error("incorrect password");
    }

    if (patient1) {
      const auth = bcrypt.compare(password, patient1.password);
      if (auth) {
        const token = createToken(patient1._id);
        res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge } * 1000);
        return res.status(200).json({ message: "Patient", user: patient1 });
      }
      throw Error("incorrect password");
    }

    if (admin1) {
      const auth = bcrypt.compare(password, patient1.password);
      if (auth) {
        const token = createToken(admin1._id);
        res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge } * 1000);
        return res.status(200).json({ message: "Admin", user: admin1 });
      }
      throw Error("incorrect password");
    }

    return res.status(401).json({ message: "Invalid credentials" });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};
const requireAuth = async (req, res, next) => {
  const token = req.cookies.jwt;

  if (token) {
    jwt.verify(token, "secret-unkown", (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        res.redirect("/login");
      } else {
        // Store the user information in the request object
        req.user = decodedToken;
        next();
      }
    });
  } else {
    res.redirect("/login");
  }
};

const logout = async (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
};

const updateUserInfoInCookie = (req, res, user) => {
  const token = createToken(user._id);
  res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
};
module.exports = { login, requireAuth, logout, updateUserInfoInCookie };
