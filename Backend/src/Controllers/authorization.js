const { default: mongoose } = require("mongoose");
const administratorModel = require("../Models/Adminstrator.js");
const DoctorModel = require("../Models/Doctor.js");
const patientModel = require("../Models/Patient.js");
const jwt = require("jsonwebtoken");
const maxAge = 3 * 24 * 6 * 60;
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const randomstring = require("randomstring");
const packagesModel = require("../Models/Packages.js");
const familyMemberModel = require("../Models/FamilyMember.js");
const appointmentModel = require("../Models/Appointment.js");

const emailService = "youstina2307@outlook.com"; // e.g., 'gmail'
const emailUser = "youstina2307@outlook.com";
const emailPassword = "23july2002";

const transporter = nodemailer.createTransport({
  service: emailService,
  auth: {
    user: emailUser,
    pass: emailPassword,
  },
});

const createToken = (id) => {
  return jwt.sign({ id }, "secret-unkown", {
    expiresIn: maxAge,
  });
};

const login = async (req, res) => {
  const { username, password } = req.body;
  let patient1;

  try {
    const doctor1 = await DoctorModel.findOne({ username });
    patient1 = await patientModel.findOne({ username });
    const admin1 = await administratorModel.findOne({ username });

    if (patient1 && patient1.package !== "  ") {
      patient1 = await patientModel
        .findOne({ username })
        .populate("packagesPatient");
      const package = await packagesModel.findById(patient1.package);
      const today = new Date();
      const renewalDate = new Date(package.renewalDate);
      if (renewalDate < today) {
        package.status = "Unsubsrcibed";
        patient1.unsubscribedHealthPackage.push(patient1.package);
        patient1.package = "  ";
        await patient1.save();
      }
    }

    if (
      patient1 &&
      patient1.familyMembers &&
      patient1.familyMembers.length > 0
    ) {
      const family = patient1.familyMembers;
      for (famIdArr of family) {
        const famId = famIdArr[0];
        const member = await familyMemberModel.findById(famId);
        if (member.package !== "  ") {
          const package = await packagesModel.findById(member.package);
          const today = new Date();
          const renewalDate = new Date(package.renewalDate);
          if (renewalDate < today) {
            package.status = "Unsubsrcibed";
            member.unsubscribedHealthPackage.push(member.package);
            member.package = "  ";
            await member.save();
          }
        }
      }
    }

    if (doctor1) {
      const auth = await bcrypt.compare(password, doctor1.password);
      if (auth) {
        const token = createToken(doctor1._id);
        res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge } * 1000);
        return res.status(200).json({ message: "Doctor", user: doctor1 });
      } else {
        return res.status(401).json({ message: "Invalid credentials" });
      }
    }

    if (patient1) {
      const auth = await bcrypt.compare(password, patient1.password);
      if (auth) {
        const token = createToken(patient1._id);
        res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge } * 1000);
        return res.status(200).json({ message: "Patient", user: patient1 });
      } else {
        return res.status(401).json({ message: "Invalid credentials" });
      }
    }

    if (admin1) {
      console.log(admin1);
      const auth = await bcrypt.compare(password, admin1.password);
      console.log(auth);
      if (auth) {
        const token = createToken(admin1._id);
        res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge } * 1000);
        return res.status(200).json({ message: "Admin", user: admin1 });
      } else {
        return res.status(401).json({ message: "Invalid credentials" });
      }
    }
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
  res.cookie("jwt", "", { maxAge: 0, httpOnly: true });
  res.status(200).json({ message: "Logout successful" });
};

const updateUserInfoInCookie = (req, res, user) => {
  const token = createToken(user._id);
  res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
};

let otpNum;

const otp = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  otpNum = randomstring.generate({
    length: 6, // Adjust the OTP length as needed
    charset: "numeric",
  });

  const mailOptions = {
    from: emailUser,
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP code is: ${otpNum}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to send OTP" });
    } else {
      console.log("OTP sent: " + info.response);
      res.status(200).json({ message: "OTP sent successfully" });
    }
  });
};


// POST API endpoint to verify the OTP
const verifyOtp = async (req, res) => {
  console.log(otpNum);
  const { inputNumber } = req.body;

  if (!inputNumber) {
    return res.status(400).json({ error: "Input number is required" });
  }

  if (otpNum === inputNumber) {
    res.status(200).json({ message: "OTP is valid." });
  } else {
    res.status(400).json({ error: "OTP is invalid." });
  }
};

const requireAdminAuth = (req, res, next) => {
  const token = req.cookies.jwt;

  if (token) {
    jwt.verify(token, "secret-unkown", async (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        res.redirect("/login");
      } else {
        const admin = await administratorModel.findById(decodedToken.id);
        if (!admin) {
          res.redirect("/login");
        } else {
          req.user = decodedToken;
          next();
        }
      }
    });
  } else {
    res.redirect("/login");
  }
};

const requireDoctorAuth = (req, res, next) => {
  const token = req.cookies.jwt;

  if (token) {
    jwt.verify(token, "secret-unkown", async (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        res.redirect("/login");
      } else {
        const doctor = await DoctorModel.findById(decodedToken.id);
        if (!doctor) {
          res.redirect("/login");
        } else {
          req.user = decodedToken;
          next();
        }
      }
    });
  } else {
    res.redirect("/login");
  }
};

const requirePatientAuth = (req, res, next) => {
  const token = req.cookies.jwt;

  if (token) {
    jwt.verify(token, "secret-unkown", async (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        res.redirect("/login");
      } else {
        const patient = await patientModel.findById(decodedToken.id);
        if (!patient) {
          res.redirect("/login");
        } else {
          req.user = decodedToken;
          next();
        }
      }
    });
  } else {
    res.redirect("/login");
  }
};

module.exports = {
  login,
  requireAuth,
  logout,
  updateUserInfoInCookie,
  otp,
  verifyOtp,
  requireAdminAuth,
  requirePatientAuth,
  requireDoctorAuth,
};
