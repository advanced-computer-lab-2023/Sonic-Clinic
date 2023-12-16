const doctorModel = require("../Models/Doctor.js");
const { default: mongoose } = require("mongoose");
const patientModel = require("../Models/Patient.js");
const PrescriptionModel = require("../Models/Prescription.js");
const appointmentModel = require("../Models/Appointment.js");
const familyMemberModel = require("../Models/FamilyMember.js");
const bcrypt = require("bcrypt");
const prescriptionModel = require("../Models/Prescription.js");
const followUpModel = require("../Models/FollowUp.js");
const medicineModel = require("../Models/Medicine.js");
const packagesModel = require("../Models/Packages.js");

const searchPatientByName = async (req, res) => {
  const { name } = req.query;

  try {
    // Create a regular expression to match partial names (case insensitive)
    const nameRegex = new RegExp(name, "i");

    // Find patients where the name matches partially
    const patients = await patientModel.find({ name: { $regex: nameRegex } });

    if (patients.length === 0) {
      return res.status(404).json({ message: "No patients found." });
    }

    res.status(200).json({ patients });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

const filterPatientsByAppointments = async (req, res) => {
  try {
    const doctor = await doctorModel.findOne(req.user.id);
    console.log(doctor);
    if (!doctor) {
      return res.status(401).json({ error: "Doctor not authenticated" });
    }

    const today = new Date();
    const doctorAppointments = await appointmentModel.find({
      doctorID: doctor._id,
    });

    const upcomingAppointments = [];
    for (const appointment of doctorAppointments) {
      const appointmentDate = new Date(appointment.date);
      console.log(appointmentDate);
      console.log(today);
      if (appointmentDate > new Date(today)) {
        upcomingAppointments.push(appointment);
      }
    }
    console.log(upcomingAppointments);
    const patientIDs = upcomingAppointments.map(
      (appointment) => appointment.patientID
    );

    // Fetch patient information for the extracted IDs
    const patients = await patientModel.find({ _id: { $in: patientIDs } });

    res.status(200).json({ patients });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const filterApointmentsByDateOrStatusDoc = async (req, res) => {
  const { date, status } = req.query;

  try {
    const doctorID = req.user.id;

    let query = { doctorID };

    if (date) {
      query.date = date;
    }

    if (status) {
      query.status = status;
    }

    const appointments = await appointmentModel.find(query);

    if (!appointments || appointments.length === 0) {
      return res.status(404).json({ message: "No appointments found." });
    }

    res.status(200).json({ appointments });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

const updateDoctorProfile = async (req, res) => {
  const { email, hourlyRate, affiliation } = req.query; // Extract fields from req.query

  const id = req.user.id;

  try {
    const doctor = await doctorModel.findOne({ _id: id });

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found." });
    }

    // Update the specified fields
    if (email) doctor.email = email;
    if (hourlyRate) doctor.hourlyRate = hourlyRate;
    if (affiliation) doctor.affiliation = affiliation;

    // Save the updated doctor profile
    await doctor.save();

    res.status(200).json({ message: "Doctor profile updated successfully." });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

const viewPatients = async (req, res) => {
  // const id = req.user.id;

  try {
    const doctor = await doctorModel.findById(req.user.id);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found." });
    }

    const patients = doctor.patients;
    if (!patients) {
      return res.status(404).json({ message: "No patients found." });
    }
    const actualPatients = [];

    for (const patientId of patients) {
      const patient = await patientModel.findOne({ _id: patientId });

      if (patient) {
        actualPatients.push(patient);
      } else {
        const familyMember = await familyMemberModel.findOne({
          _id: patientId,
        });
        actualPatients.push(familyMember);
      }
    }

    res.status(200).json({ patients: actualPatients });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
const viewInfoAndHealthRecord = async (req, res) => {
  const patientUsername = req.body.username;

  try {
    const patient = await patientModel.findOne({ username: patientUsername });

    if (!patient) {
      return res.status(404).json({ message: "Patient not found." });
    }

    // Extract relevant information and health records
    const {
      username,
      name,
      email,
      dateOfBirth,
      gender,
      mobileNumber,
      emergencyFullName,
      emergencyMobileNumber,
      package,
      prescriptions,
      healthRecords,
    } = patient;

    res.status(200).json({
      username,
      name,
      email,
      dateOfBirth,
      gender,
      mobileNumber,
      emergencyFullName,
      emergencyMobileNumber,
      package,
      prescriptions,
      healthRecords,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

const selectPatient = async (req, res) => {
  const doctorId = req.user.id;
  const { patientUsername } = req.body;

  try {
    const doctor = await doctorModel
      .findOne({ _id: doctorId })
      .populate("patients");

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found." });
    }

    const selectedPatient = doctor.patients.find(
      (patientId) => patientId.username === patientUsername
    );

    if (!selectedPatient) {
      return res.status(404).json({
        message: "Patient not found or not registered with this doctor.",
      });
    }

    res.status(200).json({ selectedPatient });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

const addPrescription = async (req, res) => {
  try {
    // const patientId = req.body.id;
    const { medicine, patientID } = req.body;
    const date = new Date();
    const dateString =
      date.getFullYear() +
      "-" +
      ("0" + (date.getMonth() + 1)).slice(-2) +
      "-" + // Months are 0-indexed
      ("0" + date.getDate()).slice(-2); // Add leading zero for single digit dates

    const doctor = await doctorModel.findById(req.user.id);
    const newPrescription = await PrescriptionModel.create({
      medicine,
      doctorID: req.user.id,
      patientID: patientID,
      date: dateString,
      status: "Not filled",
      doctorName: doctor.name,
    });
    const patient = await patientModel.findById(patientID);
    patient.prescreptions.push(newPrescription);
    await patient.save();
    console.log("Prescription Created!");
    res.status(200).send(newPrescription);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};
const viewDocApp = async (req, res) => {
  try {
    let patient;
    const appointments = await appointmentModel.find({ doctorID: req.user.id });
    for (const app of appointments) {
      patient = await patientModel.findById(app.patientID);
      if (patient) {
        await app.populate("patient");
        // console.log(app);
      } else {
        await app.populate("familyMember");
        // console.log(app);
      }
    }
    res.status(200).json(appointments);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

function parseDateString(dateString) {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day); // Month is 0-indexed in JavaScript Date
}

const addAvailableSlots = async (req, res) => {
  const slots = req.body.slots;

  try {
    // Find the doctor by ID
    const doctor = await doctorModel.findById(req.user.id);

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found." });
    }

    doctor.availableSlots = doctor.availableSlots.concat(slots);

    // Save the updated doctor document
    await doctor.save();

    res.status(200).json({
      message: "Available slots added successfully.",
      slots,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

const viewAllAppointmentsDoctor = async (req, res) => {
  try {
    const id = req.user.id;
    const appointments = await appointmentModel
      .find({ doctorID: id })
      .populate("patient");

    if (!appointments || appointments.length === 0) {
      return res.status(404).json({ message: "No appointments found." });
    }

    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
const changePasswordForDoctor = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const doctorID = req.user.id;

  try {
    const doctor = await doctorModel.findById(doctorID);

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found." });
    }

    const isPasswordCorrect = await bcrypt.compare(
      currentPassword,
      doctor.password
    );

    if (!isPasswordCorrect) {
      return res
        .status(401)
        .json({ message: "Current password is incorrect." });
    }
    const salt = await bcrypt.genSalt();
    newPasswordHashed = await bcrypt.hash(newPassword, salt);
    doctor.password = newPasswordHashed;
    await doctor.save();

    res.status(200).json({ message: "Password changed successfully." });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

const addAppointmentByPatientID = async (req, res) => {
  try {
    const doctorID = req.user.id;

    const { date, description, patientID, status, time } = req.body;

    const patient = await patientModel.findById(patientID);
    const doctor = await doctorModel.findById(doctorID);

    // Create a new appointment with doctorID, patientID, and other details
    const appointment = await appointmentModel.create({
      date,
      description,
      patientID,
      doctorID,
      status,
      time,
    });

    notificationByMail(
      patient.email,
      "An appointment has been reserved with Dr. " +
        doctor.name +
        " on " +
        appointment.date +
        " at " +
        appointment.time,
      "New Appointment Reservation"
    );

    notificationByMail(
      doctor.email,
      "An appointment has been reserved with " +
        patient.name +
        " on " +
        appointment.date +
        " at " +
        appointment.time,
      "Appointment Reserved"
    );

    //   const doctor= await doctorModel.findById(req.user.id);
    //   doctor.patients.push(patientID);
    //  await  doctor.save();

    res
      .status(201)
      .json({ message: "Appointment added successfully.", appointment });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

const viewAvailableSlots = async (req, res) => {
  try {
    const doctor = await doctorModel.findById(req.user.id);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found." });
    }

    // Get the available slots of the doctor
    const availableSlots = doctor.availableSlots || [];

    if (availableSlots.length === 0) {
      return res
        .status(404)
        .json({ message: "This doctor has no available slots." });
    }

    return res.status(200).json({ availableSlots });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

const viewWalletDoc = async (req, res) => {
  try {
    const doc = await doctorModel.findById(req.user.id);
    const wallet = doc.wallet;
    res.status(200).json(wallet);
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

const acceptContract = async (req, res) => {
  try {
    const doc = await doctorModel.findById(req.user.id);

    if (!doc) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    doc.contract = true;
    await doc.save();

    res.status(200).json("Contract Accepted");
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};
const changePasswordForDoctorForget = async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    if (!email || !newPassword) {
      return res
        .status(400)
        .json({ message: "Email and newPassword are required." });
    }

    let doctor = await doctorModel.findOne({ email });

    if (!doctor) {
      return res.status(404).json({ message: "Email does not exist." });
    }

    doctor.password = newPassword;
    await doctor.save();

    res.status(200).json({ message: "Password changed successfully." });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

const viewPrescriptionsDoc = async (req, res) => {
  try {
    const id = req.user.id;

    const prescriptions = await prescriptionModel.find({ doctorID: id });

    if (!prescriptions) {
      return res.status(404).json({ message: "No prescriptions found." });
    }
    res.status(200).json(prescriptions);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

const calculateSessionPrice = async (hourlyRate, patientPackage) => {
  try {
    if (!patientPackage || patientPackage.trim() === "") {
      return hourlyRate;
    }

    const packageInfo = await packagesModel.findById(patientPackage);

    if (!packageInfo) {
      console.error("Package information not found for ID:", patientPackage);
      return hourlyRate;
    }

    const sessionPrice =
      hourlyRate * 1.1 * (1 - packageInfo.sessionDiscount * 0.01);

    console.log("Session price calculated:", sessionPrice);

    return sessionPrice;
  } catch (error) {
    console.error("Error calculating session price:", error);
    throw error; // You may choose to handle the error differently based on your needs
  }
};

const cancelAppointmentDoc = async (req, res) => {
  try {
    let notificationDoc;
    let notification;
    let patient;
    const doctor = await doctorModel.findById(req.user.id);
    const appId = req.body.id;
    const appointment = await appointmentModel.findById(appId);
    if (!appointment) {
      return res.status(404).json({ message: "No appointment found." });
    }
    patient = await patientModel.findById(appointment.patientID);
    const date = appointment.date;
    const time = appointment.time;
    const dateTimeString = `${date}T${time}:00.000Z`;
    console.log(dateTimeString);
    const inputDate = new Date(dateTimeString);
    const currentDate = new Date();
    const timeDifference = inputDate - currentDate;
    const hoursDifference = timeDifference / (1000 * 60 * 60);
    if (hoursDifference < 24) {
      return res.status(401).json({
        message: "Appointment is in less than 24 hours",
      });
    }

    let package;
    if (patient) {
      package = patient.package;
    } else {
      const famMem = await familyMemberModel.findById(appointment.patientID);
      package = famMem.package;
    }
    appointment.status = "Cancelled";
    await appointment.save();

    const sessionPrice = await calculateSessionPrice(
      doctor.hourlyRate,
      package
    );

    doctor.wallet -= sessionPrice;
    await doctor.save();

    patient.wallet += sessionPrice;
    await patient.save();

    notificationByMail(
      patient.email,
      "The appointment with Dr. " +
        doctor.name +
        " on " +
        appointment.date.split("-").reverse().join("/") +
        " at " +
        appointment.time +
        " has been cancelled",
      "Appointment Cancelled"
    );
    console.log("4");
    console.log("mail");
    notificationByMail(
      doctor.email,
      "An appointment has been cancelled with " +
        patient.name +
        " on " +
        appointment.date.split("-").reverse().join("/") +
        " at " +
        appointment.time,
      "Appointment Cancelled"
    );
    const id = appointment.patientID;
    console.log(appointment.patientID);
    patient = await patientModel.findById(id);
    if (patient) {
      console.log("patient");
      notification =
        "The appointment with Dr. " +
        doctor.name +
        " has been cancelled upon the Dr request";
      patient.notifications.push(notification);
      patient.newNotifications = true;
      await patient.save();
      notificationDoc =
        "An appointment with " + patient.name + " has been cancelled";
      doctor.notifications.push(notificationDoc);
      doctor.newNotifications = true;
      await doctor.save();
    } else {
      const familyMem = await familyMemberModel.findById(appointment.patientID);
      if (familyMem) {
        const parent = await patientModel.findById(req.user.id);
        notification =
          "The appointment with Dr. " +
          doctor.name +
          " for " +
          familyMem.name +
          " has been cancelled upon the Dr request ";
        parent.notifications.push(notification);
        parent.newNotifications = true;
        await parent.save();
        notificationDoc =
          "An appointment with " + familyMem.name + " has been cancelled";
        doctor.notifications.push(notificationDoc);
        doctor.newNotifications = true;
        await doctor.save();
      }
      if (familyMem && familyMem.patientRef) {
        const linkedP = await patientModel.findById(familyMem.patientRef);
        notification =
          "Your appointment with Dr. " +
          doctor.name +
          " has been cancelled upon the Dr request";
        linkedP.notifications.push(notification);
        linkedP.newNotifications = true;
        await linkedP.save();
      }
    }

    res.status(200).json(appointment);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
const viewFollowUpsReq = async (req, res) => {
  try {
    const id = req.user.id;
    const followUps = await followUpModel.find({ doctorID: id });
    res.status(200).json(followUps);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

const acceptFollowUp = async (req, res) => {
  try {
    const followUpId = req.body;
    const followUp = await followUpModel.findById(followUpId);
    const appointment = await appointmentModel.create({
      date: followUp.date,
      description: followUp.description,
      patientID: followUp.patientID,
      doctorID: followUp.doctorID,
      status: followUp.status,
      time: followUp.time,
    });

    const followUpIndex = doctor.followUps.findIndex((followUp) =>
      followUp._id.equals(followUpId)
    );
    if (followUpIndex !== -1) {
      doctor.followUps.splice(followUpIndex, 1);
      await doctor.save();
    } else {
      res.status(401).json("follow Up not found for this doctor");
    }
    const deleted = await followUpModel.findByIdAndDelete(followUpId);
    if (!deleted) {
      res.status(401).json("no followUp found");
    }

    const doctorAvailableSlots = doctor.availableSlots;

    let isAvailableSlot = false;
    let slot2;
    for (const slot of doctorAvailableSlots) {
      const [dateS, timeS] = slot.split(" ");
      if (dateS === followUp.date && timeS === followUp.time) {
        slot2 = slot;
        isAvailableSlot = true;
        break;
      }
    }

    if (!isAvailableSlot) {
      return res
        .status(400)
        .json({ message: "Appointment date is not available." });
    }

    // If the date is available, remove it from the doctor's available slots
    doctor.availableSlots = doctorAvailableSlots.filter((slot) => {
      return slot !== slot2;
    });

    await doctor.save();

    res.status(200).json(appointment);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

const rejectFollowUp = async (req, res) => {
  try {
    const followUpId = req.body;
    const followUpIndex = doctor.followUps.findIndex((followUp) =>
      followUp._id.equals(followUpId)
    );
    if (followUpIndex !== -1) {
      doctor.followUps.splice(followUpIndex, 1);
      await doctor.save();
    } else {
      res.status(401).json("follow Up not found for this doctor");
    }
    const deleted = await followUpModel.findByIdAndDelete(followUpId);
    if (!deleted) {
      res.status(401).json("no followUp found");
    }

    res.status(200).json(deleted);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

const rescheduleAppDoc = async (req, res) => {
  try {
    const appId = req.body.id;
    const date = req.body.date;
    const time = req.body.time;
    let notification;
    let notificationDoc;
    const appointment = await appointmentModel.findById(appId);
    appointment.date = date;
    appointment.time = time;
    appointment.status = "Upcoming";
    await appointment.save();
    const doctor = await doctorModel.findById(req.user.id);
    const docName = doctor.name;
    notification =
      "Your appointment with Dr. " +
      docName +
      " has been rescheduled upon the Dr request to be on " +
      date.split("-").reverse().join("/") +
      " at: " +
      time;

    const patientId = appointment.patientID;
    const patient = await patientModel.findById(patientId);
    notificationDoc =
      "Your appointment with " +
      patient.name +
      " has been rescheduled to be on " +
      date.split("-").reverse().join("/") +
      " at: " +
      time;
    if (patient) {
      patient.notifications.push(notification);
      patient.newNotifications = true;
      await patient.save();
      doctor.notifications.push(notificationDoc);
      doctor.newNotifications = true;
      await doctor.save();
    } else {
      const familyMem = await familyMemberModel.findById(appointment.patientID);
      if (familyMem) {
        const parent = await patientModel.findById(req.user.id);
        notification =
          "The appointment with Dr. " +
          doctor.name +
          " for " +
          familyMem.name +
          " has been rescheduled upon the Dr request to be on " +
          date.split("-").reverse().join("/") +
          " at: " +
          time;
        parent.notifications.push(notification);
        parent.newNotifications = true;
        await parent.save();
        notificationDoc =
          "An appointment with " +
          familyMem.name +
          " has been rescheduled to be on " +
          date.split("-").reverse().join("/") +
          " at: " +
          time;
        doctor.notifications.push(notificationDoc);
        doctor.newNotifications = true;
        await doctor.save();
      }
      if (familyMem && familyMem.patientRef) {
        const linkedP = await patientModel.findById(familyMem.patientRef);
        notification =
          "Your appointment with Dr. " +
          doctor.name +
          " has been rescheduled upon the Dr request to be on " +
          date.split("-").reverse().join("/") +
          " at: " +
          time;
        linkedP.notifications.push(notification);
        linkedP.newNotifications = true;
        await linkedP.save();
      }
    }
    notificationByMail(
      patient.email,
      "The appointment with Dr. " +
        doctor.name +
        " has been rescheduled to " +
        appointment.date.split("-").reverse().join("/") +
        " at " +
        appointment.time,
      "Appointment Rescheduled"
    );

    notificationByMail(
      doctor.email,
      "An appointment has been rescheduled with " +
        patient.name +
        " on " +
        appointment.date.split("-").reverse().join("/") +
        " at " +
        appointment.time,
      "Appointment Rescheduled"
    );

    const doctorAvailableSlots = doctor.availableSlots;

    let isAvailableSlot = false;
    let slot2;
    for (const slot of doctorAvailableSlots) {
      const [dateS, timeS] = slot.split(" ");
      if (dateS === date && timeS === time) {
        slot2 = slot;
        isAvailableSlot = true;
        break;
      }
    }

    // If the date is available, remove it from the doctor's available slots
    if (isAvailableSlot) {
      doctor.availableSlots = doctorAvailableSlots.filter((slot) => {
        return slot !== slot2;
      });

      await doctor.save();
    }

    res.status(200).json(appointment);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
const viewNotifications = async (req, res) => {
  try {
    let notifications;
    const id = req.user.id;
    const doctor = await doctorModel.findById(id);
    if (doctor) {
      notifications = doctor.notifications;
    } else {
      const patient = await patientModel.findById(id);
      notifications = patient.notifications;
    }
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
const notificationFlag = async (req, res) => {
  try {
    const id = req.user.id;
    const doctor = await doctorModel.findById(id);
    if (doctor) {
      doctor.newNotifications = false;
      await doctor.save();
    } else {
      const patient = await patientModel.findById(id);
      patient.newNotifications = false;
      await patient.save();
    }
    res.status(200).json("Notification flag = false");
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
const nodemailer = require("nodemailer");
const emailService = "youstina2307@outlook.com";
const emailUser = "youstina2307@outlook.com";
const emailPassword = "23july2002";
const transporter = nodemailer.createTransport({
  service: emailService,
  auth: {
    user: emailUser,
    pass: emailPassword,
  },
});
const notificationByMail = async (email, message, title) => {
  const mailOptions = {
    from: emailUser,
    to: email,
    subject: title,
    text: message,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    return;
  });
};
const viewMedicines = async (req, res) => {
  try {
    const medicines = await medicineModel.find();

    if (!medicines) {
      return res.status(404).json({ message: "No medicines found" });
    }
    res.status(200).json(medicines);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

const addMedicineToPrescription = async (req, res) => {
  try {
    const doctorID = req.user.id;
    const { patientID, medicines } = req.body;

    // Fetch doctorName from req.user.name
    const doctor = await doctorModel.findById(doctorID);
    const doctorName = doctor.name;
    console.log(doctorName);

    // Create an array to store the medicines
    const medicinesArray = [];

    // Loop through each medicine in the request body
    for (const medicineID of medicines) {
      // Check if the medicine already exists
      const existingMedicine = await medicineModel.findById(medicineID);

      if (!existingMedicine) {
        return res.status(400).json({ error: `Medicine not found` });
      }

      // Add the medicine to the medicines array with the required quantity
      medicinesArray.push(existingMedicine);
    }

    // Create a new prescription
    const prescription = await prescriptionModel.create({
      medicine: medicinesArray,
      doctorID,
      patientID,
      status: "Not submitted", // Assuming you want to set an initial status
      date: new Date(),
      doctorName: doctorName,
      submitted: false, // Assuming you want to set an initial submitted status
    });

    // Save the prescription
    await prescription.save();

    // Send a success response
    res.status(200).json(prescription);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const removeMedicineFromPrescription = async (req, res) => {
  try {
    const { prescriptionID, medicineID } = req.body;

    // Check if the prescription exists
    const prescription = await prescriptionModel.findById(prescriptionID);
    let flag = false;

    if (!prescription) {
      return res.status(400).json({ error: `Prescription not found` });
    }

    // Check if the medicine exists in the prescription
    for (const medicine of prescription.medicine) {
      if (medicineID == medicine._id) {
        flag = true;
      }
    }

    if (!flag) {
      return res
        .status(400)
        .json({ error: `Medicine not found in the prescription` });
    }

    // Remove the medicine from the prescription
    prescription.medicine = prescription.medicine.filter(
      (med) => med._id.toString() !== medicineID
    );

    // Save the updated prescription
    await prescription.save();

    // Send a success response
    res.status(200).json(prescription);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const updatePrescription = async (req, res) => {
  try {
    const doctorID = req.user.id;
    const { prescriptionID, medicine } = req.body;

    const doctor = await doctorModel.findById(doctorID);
    const existingPrescription =
      await prescriptionModel.findById(prescriptionID);

    const patient = await patientModel.findById(existingPrescription.patientID);

    if (!existingPrescription.doctorID === doctorID) {
      return res
        .status(400)
        .json({ error: `You can not edit in this prescription` });
    }

    if (!existingPrescription) {
      return res.status(400).json({ error: `Prescription not found` });
    }
    // Update prescription properties with new values
    existingPrescription.medicine = medicine;

    // Save the updated prescription
    await existingPrescription.save();
    const patientPres = patient.prescreptions;
    for (const pres of patientPres) {
      if (pres._id == prescriptionID) {
        pres.medicine = medicine;
        patient.markModified("prescreptions");
        await patient.save();
      }
    }
    await patient.save();

    // Send a success response
    res.status(200).json(patient);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  selectPatient,
  viewInfoAndHealthRecord,
  viewPatients,
  updateDoctorProfile,
  filterApointmentsByDateOrStatusDoc,
  filterPatientsByAppointments,
  searchPatientByName,
  addPrescription,
  viewDocApp,
  addAvailableSlots,
  viewAllAppointmentsDoctor,
  changePasswordForDoctor,
  viewAvailableSlots,
  addAppointmentByPatientID,
  viewWalletDoc,
  acceptContract,
  changePasswordForDoctorForget,
  viewPrescriptionsDoc,
  cancelAppointmentDoc,
  viewFollowUpsReq,
  acceptFollowUp,
  rejectFollowUp,
  rescheduleAppDoc,
  viewNotifications,
  notificationFlag,
  viewMedicines,
  addMedicineToPrescription,
  removeMedicineFromPrescription,
  updatePrescription,
};
