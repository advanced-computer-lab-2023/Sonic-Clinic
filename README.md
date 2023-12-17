# Sonic-Clinic

## Project Title
El7a2ny is a complete software solution designed for clinics, doctors, pharmacists, and patients. It aims to facilitate and automate interactions between patients, doctors, and pharmacists. The system helps find suitable doctors, schedule meetings, manage prescriptions, set and receive reminders, access medical history, conduct video and text chats, and order prescribed medications.

## Motivation
The motivation behind El7a2ny is to enhance the healthcare experience using technology to simplify and optimize the interactions between healthcare providers and patients. By creating a virtual clinic with an integrated pharmacy, the goal is to make healthcare services more accessible, efficient, and user-friendly.

## Tech/Framework Used

- **MERN Stack:** Combines MongoDB, Express.js, React, and Node.js for full-stack development.
- **Socket.io:** Used for video chat functionality.
- **Stripe:** Integrated for secure card payment processing.
- **Postman:** Utilized for testing API endpoints.
- **Redux:** Used for state management in the frontend.
- **Bootstrap:** Utilized for responsive and visually appealing UI design.
- **JWT Authentication:** Implemented for secure user authentication.
- **nodemon:** Employed for automatic server restart during development.



## Features

### Patient Features

- **Prescriptions:**
  - View details of prescriptions, including medicines and instructions.
  - Pay for prescriptions using Stripe or wallet balance.

- **Family Members:**
  - Access information and health records of registered family members.
  - Add new family members and manage their health profiles.

- **Appointments:**
  - Filter appointments by date or status.
  - View all appointments and manage follow-ups.
  - Schedule appointments for yourself or family members.

- **Health Packages:**
  - View available health packages.
  - Subscribe to health packages using Stripe, wallet balance, or family subscription.
  - Cancel subscribed health packages.

- **Wallet:**
  - View wallet balance and transactions.
  - Pay for appointments and health packages using wallet balance.

- **Profile Management:**
  - Change password securely.
  
- **Upload and Access Documents:**
  - Upload and manage medical records securely.
  - Download prescriptions and documents.

### Doctor Features

- **View Patient Information:**
  - Access patient information and health records.
  - Search for patients by name.
  - View appointments and health records for individual patients.

- **Appointments:**
  - Filter appointments by date or status.
  - View all appointments and manage follow-ups.
  - Schedule appointments for patients.
  - Add available slots for patients to reserve appointments.

- **Prescriptions:**
  - Add prescriptions with medicines and respective dosages.
  - View and update prescriptions.
  - Manage medicines within prescriptions.

- **Profile Management:**
  - Change password securely.
  - Update doctor profile details.

- **Upload and Access Documents:**
  - View patient medical history.
  - Upload medical files for patients.

### Administrator Features

- **Manage Users:**
  - Add or remove administrators, doctors, and patients.
  - View doctors applications; accept or reject them.

- **View Data:**
  - View all doctors, patients, and admins.
  - View, manage, and delete health packages.


### Guest Features

- **Patient Registration:**
  - Register as a new patient.

- **Doctor Registration:**
  - Apply as a doctor.

### General Features

- **Notification System:**
  - View notifications for appointments, follow-ups, and other important events.
  - Manage notification settings.

- **Chat Functionality:**
  - View contacts.
  - View individual chats and send messages.

- **Video Chat Functionality:**
  - Users can do video calls.


## Authorization and Security

- **User Authentication  (JWT athentication) :**
  - Implement role-based authentication for patients, doctors, and administrators.
  - Logout securely.

- **Password Management:**
  - Implement password forget functionality securely with OTP verification for patients, doctors, and administrators.



## Installation

Follow these steps to set up and run the software on your local machine.

### Prerequisites

Make sure you have the following software installed on your system:

- [Node.js](https://nodejs.org/): JavaScript runtime built on Chrome's V8 JavaScript engine.
- [npm](https://www.npmjs.com/): Node.js package manager.
- [MongoDB](https://www.mongodb.com/): NoSQL database.
- [Git](https://git-scm.com/): Version control system.

### Clone the Repository

```bash
git https://github.com/advanced-computer-lab-2023/Sonic-Clinic.git
```
#### To run the backend:
```bash
cd backend/src
```
```bash
npm i
```
```bash
nodemon server.js
```
#### To run the frontend:
```bash
cd frontend/src
```
```bash
npm i
```
```bash
npm update
```
```bash
npm start

```
### Create .env file and add the following:
MONGO_URI= "mongodb+srv://Clinic:Pass_123@cluster0.afyaloc.mongodb.net/?retryWrites=true&w=majority"
PORT=8001


## Testing

Use [this Postman link](https://app.getpostman.com/join-team?invite_code=94b34bb7917a4b47958f05519be1b46c&target_code=a52193778b9ecf01728d1a903cbf6885) to test all the APIs.


## How to Use

Follow these steps to navigate and use Sonic-Clinic effectively:
### General:
### 1. Register or Log In

- If you want to sign up as a patient, click on the "Sign up" button on the login page.
- If you want to sign up as a doctor, click on the "Register as a doctor" button on the top right corner of the login page.
- Fill in the required information and complete the registration process.
- If you're already registered, enter your credentials right away in the login page.

### 2. Explore Dashboard

- Upon successful login, you'll be directed to your personalized dashboard.
- Navigate through the menu on the top left of the screen to access different features.
- While navigating, the menu on the top left contains all routes to take you back. 

### 3. Profile Management

- View and update your personal information under the "My Profile" section in the menu.
- Change your password securely by confirming your old password then choosing a new strong one.

### 4. Chatting

- Click on the orange chat icon on the bottom right corner to use the Chat functionality.
- View, create and respond to individual chat messages.
- In a chat, click on the video icon to initiate a video call.

### 5. Log Out

- When done, click on the "Log Out" button in the menu to securely log out of your account.

### 6. Notifications

- Click on the blue bell icon on the top right corner to view your notifications.

### Patient:
### 1. View Doctors and Manage Appointments

- Click on "View All Doctors" in the Home Page, filter doctos by speciality, date and time and click on apply or you can search for a doctor by his name.
- To book aa appointment, select your desired doctor and choose from his/her list of free available slots.
- To view, reschedule, request follow up, cancel or filter your appointments: Click on the "My Appointments" section in the menu

### 2. Manage Prescriptions

- Access the "Prescriptions" section in the menu to view and filter the prescriptions provided by your doctors.
- Click on a desired prescription to see its detailed information, to buy it and to download it as a pdf.

### 3. Profile

- Access the "My profile" section
- You can click on 'change your password' to update your password.
- View and add family members, either new users or existing users.
- Upload and view your helath records.
- Explore and subscribe to available health packages and view all your subscription history.

### Doctor:
### 1. Manage Appointments

- Access "My Appointments" in the menu to view and filter booked appointments by date and time.
- Access "Free slots" inside the "My Appointments" section to add free appointment slots that patients can book.
- Access "Follow-up requests" inside the "My Appointments" section to search and accept or reject follow up requests from patients.

### 2. Manage Patients

- Access the "My Patient" section in the menu to view and filter your patients by appointment status.
- You can search for a patient by his/her name
- Click on a desired patient to see his detailed information, schedule a follow-up for an old appointment, upload his/her health records, add, view, update and delete prescriptions.

### 3. Profile

- Access the "My profile" section in the menu
- You can click on 'change your password'to update your password and you can view your employment contract pdf.
- You can click on the pen icon to update some personal information.

### Admin:
### 1. Profile

- Access the "My profile" section in the menu to view your personal details.
- You can click on 'change your password' to update your password.

### 2. Patient

- Access the "Patients" section in the menu to view all patients (full name, email and username)
- Use the search bar to search for a patient by name
- You can remove a patient by clicking on the red bin

### 3. Doctors

- Access the "Docots" section in the menu to view all registered doctors (full name, email, username and affiliation)
- Use the search bar to search for a doctor by name
- You can remove a doctor by clicking on the red bin

- Click on the requests to view new doctors that are requesting to join the platform
- Click on any doctor to view all his details 
- click on the green tick or the red cross to accept or reject the request of a doctor

### 4. Admins

- Access the "Admins" section in the menu to view all Admins (full name, email and username)
- Use the search bar to search for an admin by name
- Click on Add new administrator blue button, enter the required fields and click on create to add a new admin (click on close form if you change your mind)
- You can delete an admin by clicking on the red bin

### 5. Health Packages

- Access the "Health Packages" section in the menu to view all Health Packages
- Click on the right and left arrows to scroll through the packages
- Click to the top right blue pen, enter details and click on save to edit a health package
- Click on the blue plus sign to add a new health package (click on the minus sign if you change your mind)


## Screenshots of the System

Access the [Google Drive folder](https://drive.google.com/drive/folders/1Nqq8H35nmAYbNz82tsrXSa3r3NvYQdoi?usp=drive_link) to view screenshots of the Sonic-Clinic system.

Feel free to explore the provided images for an in-depth look at the user interface, features, and functionalities of Sonic-Clinic.


## Credits

A special thanks to the following YouTube channels for providing excellent tutorials on web development technologies:

- [Academind](https://www.youtube.com/channel/UC29ju8bIPH5as8OGnQzwJyA)
- [Traversy Media](https://www.youtube.com/channel/UCW5YeuERMmlnqo4oq8vwUpg)

### Tutorials and Playlists:

- **Node.js:**
  - [Node.js Crash Course](https://www.youtube.com/playlist?list=PLZlA0Gpn_vH_uZs4vJMIhcinABSTUH2bY)

- **Express.js:**
  - [Express.js Crash Course](https://www.youtube.com/watch?v=fgTGADljAeg)

- **React:**
  - [React Introduction](https://www.youtube.com/playlist?list=PLZlA0Gpn_vH_NT5zPVp18nGe_W9LqBDQK)
  - [React Hooks - Functional Components](https://www.youtube.com/playlist?list=PLZlA0Gpn_vH8EtggFGERCwMY5u5hOjf-h)
  - [React useState VS useEffect](https://codedamn.com/news/reactjs/usestate-and-useeffect-hooks)
  
- **JWT Authentication:**
  - [JWT Authentication Tutorial](https://www.youtube.com/watch?v=mbsmsi7l3r4)
  - [MERN Stack Authentication Tutorial](https://www.youtube.com/watch?v=-RCnNyD0L-s)
  - [MERN Stack Authentication Tutorial - Part 1](https://dev.to/salarc123/mern-stack-authentication-tutorial-part-1-the-backend-1c57)

- **Stripe for Payment Process:**
  - [Stripe API Overview](https://youtu.be/1r-F3FIONl8)

A big thank you to the creators of these tutorials for their valuable contributions to the developer community.



## Code Style

We applied a set of coding conventions to maintain consistency and readability across the project. Please follow these guidelines when contributing to the codebase:

- **JavaScript/Node.js:** We follow the [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript) for JavaScript and Node.js projects.

- **React:** For React components and applications, we follow the [Airbnb React/JSX Style Guide](https://github.com/airbnb/javascript/tree/master/react).

- **Naming Conventions:** Descriptive and meaningful variable and function names are encouraged. Please avoid abbreviations when clarity is sacrificed.

- **Indentation:** We use two spaces for indentation in JavaScript and its related files.

- **Comments:** Include comments where necessary to explain complex code sections or to provide context. Follow a consistent comment style.

- The code style is enforced using eslint and prettier. The code style is enforced using pre-commit hooks and pre-commit github action.

Before submitting a pull request, please ensure that your code sticks to these conventions. Consistent coding practices enhance collaboration and make the codebase more maintainable.



## Code Examples

## Backend (node js)

### Sending Automatic Emails 

Below is an example Node.js function using the Nodemailer library to send automatic emails. This function can be employed for many purposes, such as sending OTPs for forgotten passwords and notifications.

```javascript
const nodemailer = require("nodemailer");

// Configure your email service details
const emailService = "[your email service]";
const emailUser = "[your email]";
const emailPassword = "[your email password]";

// Create a Nodemailer transporter
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
    to: email, // email of the recipient
    subject: title,
    text: message,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    return;
  });
};

```

### Converting Text to PDF and Downloading Prescription

The following Node.js function demonstrates how to convert text to a PDF file, which can be utilized for downloading prescriptions. This function is particularly used in generating PDF documents of prescriptions.

```javascript
const downloadPrescriptions = async (req, res) => {
  try {
    // Extract Prescription ID from the request query
    const PrescriptionId = req.query.id;
    
    // Retrieve prescription details from the database
    const prescription = await prescriptionsModel.findById(PrescriptionId);

    // Check if the prescription exists
    if (!prescription) {
      return res.status(404).json({ error: "Prescription not found" });
    }

    // Encode the filename to handle special characters
    const sanitizedFilename = encodeURIComponent(`${PrescriptionId}_Prescription`);
    
    // Generate PDF buffer using a helper function (e.g., generatePdfBuffer)
    const buffer = await generatePdfBuffer(prescription);

    // Set response headers for PDF download
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${sanitizedFilename}.pdf"`
    );
    
    // Send the PDF buffer as the response
    res.end(buffer);
  } catch (error) {
    // Handle errors and send an appropriate response
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

```

### Searching by Name

The following Node.js function demonstrates how to search for patients by name. 

```javascript
const searchPatientByName = async (req, res) => {
  // Extract the 'name' parameter from the request query
  const { name } = req.query;

  try {
    // Create a regular expression to match partial names (case insensitive)
    const nameRegex = new RegExp(name, "i");

    // Find patients where the name matches partially
    const patients = await patientModel.find({ name: { $regex: nameRegex } });

    // Check if any patients are found
    if (patients.length === 0) {
      return res.status(404).json({ message: "No patients found." });
    }

    // Send the list of matching patients as a response
    res.status(200).json({ patients });
  } catch (error) {
    // Handle errors and send an appropriate response
    res.status(500).json({ message: "Server Error" });
  }
};

```

## Frontend (React)

### Patient Sign-Up Page

```jsx
import React from 'react';
import AppNavbarGuest from './AppNavbarGuest';
import PatientSignupForm from './PatientSignupForm';
import { Container, Card, Image } from 'react-bootstrap'; // Import necessary Bootstrap components

const PatientSignupPage = () => {
  return (
    <div>
      <AppNavbarGuest flag={false} />
      <Container fluid className="bg-light pt-3 mt-2">
        <Container className="bg-white px-5 py-4 d-flex align-items-center justify-content-center">
          <div className="d-flex w-100 align-items-center">
            <div className="col-12 col-lg-7">
              {/* Include your PatientSignupForm component */}
              <PatientSignupForm />
            </div>
            <div className="col-lg-5">
              <Card style={{ height: "700px" }}>
                <div style={{ overflow: "hidden", height: "100%" }}>
                  {/* Include your image component, assuming 'family' is an imported image */}
                  <Image
                    src={family}
                    alt="Family"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>
              </Card>
            </div>
          </div>
        </Container>
      </Container>
    </div>
  );
};

export default PatientSignupPage;
 
 ```

### Login Page

```jsx
import React from 'react';
import AppNavbarGuest from './AppNavbarGuest';
import LoginForm from './LoginForm';
import RegPhoto from './RegPhoto';
import { Container } from 'react-bootstrap'; // Import necessary Bootstrap components

const LoginPage = () => {
  return (
    <div>
      <AppNavbarGuest flag={false} />
      <Container fluid className="bg-light pt-3 mt-2">
        <Container className="bg-white px-5 py-4 d-flex align-items-center justify-content-center">
          <div className="d-flex w-100 align-items-center">
            <div className="col-lg-5 order-lg-2 d-none d-lg-block">
              {/* Include your RegPhoto component */}
              <RegPhoto />
            </div>
            <div className="col-12 col-lg-7 order-lg-1">
              {/* Include your LoginForm component */}
              <LoginForm />
            </div>
          </div>
        </Container>
      </Container>
    </div>
  );
};

export default LoginPage;

 ```

### Health Packages

```jsx
import React from 'react';
import AppNavbar from './AppNavbar';
import HamburgerMenu from './HamburgerMenu';
import { Container, Row } from 'react-bootstrap'; // Import necessary Bootstrap components
import HealthPackageCard from './HealthPackageCard';
import ChatPat from './ChatPat';

const YourComponentName = () => {
  return (
    <div>
      <AppNavbar hamburgerMenu={<HamburgerMenu />} />
      <Container fluid className="bg-light pt-3 mt-2">
        <Container className="bg-white px-5 py-4 d-flex align-items-center justify-content-center">
          <Row className="w-100">
            <div>
              {/* Include your HealthPackageCard component */}
              <HealthPackageCard />
            </div>
          </Row>
        </Container>
      </Container>
      {/* Include your ChatPat component with props */}
      <ChatPat who="patient" />
    </div>
  );
};

export default YourComponentName;

```



## Status Build

### Current Issues

1. *Long Loading Time:*
   - Users may experience extended loading times during certain interactions. We are actively working to optimize performance and enhance the overall user experience.

2. *Code Structure Enhancement:*
   - The code structure is functional but could benefit from further enhancement for better readability, maintainability, and scalability. We appreciate your patience as we strive to improve the codebase.

3. *Platform Linking:*
   - The linkage between platforms needs refinement. Our team acknowledges the importance of seamless integration, and we are committed to enhancing the connection between different components for a smoother user experience.

4. *Chat Construction Using Arrays:*
   - The construction of chats currently relies on arrays, which may impact efficiency. We are exploring alternative approaches to optimize chat construction and ensure real-time communication.

5. *Appointment Management:*
   - Users have reported an issue where the "Add Appointment" feature works only once. Additionally, family members face challenges in rescheduling or canceling appointments without logging out and logging back in. We are actively investigating and addressing this limitation to provide a more seamless appointment management experience. Family members who are already users can reschedule and cancel appointments from their own accounts, rather than relying on the parent's account.

6. *Cannot Add Consecutive Appointments:*
   - Users currently cannot add two consecutive appointments in a row.,they need to go to another page then return and book another.We understand the importance of this feature and are working to address this limitation to allow for more flexible scheduling.

7. *Video Chat Termination:*
   - Video chats may not terminate instantly and, in some cases, close only from one side, necessitating a page reload for proper termination. We are actively working to resolve this issue to ensure smooth and prompt termination of video calls.

8. *Appointment Processing Delay for Email Sending:*
   - Adding, rescheduling, and canceling appointments may experience processing delays before emails are sent. We are addressing this delay to expedite the email notification process for improved user experience.

### Next Steps

Our development team is actively working on addressing the identified issues and implementing improvements. We appreciate your understanding and patience as we strive to make the necessary enhancements to deliver a more robust and user-friendly application.

### How You Can Contribute

Your feedback is crucial in shaping the future of our project. If you encounter any issues not mentioned here or have suggestions for improvement, please feel free to open an issue on our GitHub repository or reach out to our support team.



## Contribute

We welcome and appreciate contributions from the community! If you'd like to contribute to the development of El7a2ny, please follow these guidelines:

1. Fork the repository and clone it to your local machine. (follow installation steps)
2. Create a new branch for your contribution: `git checkout -b feature/new-feature`.
3. Make your changes and ensure that the code follows our coding standards.
4. Test your changes thoroughly.
5. Commit your changes: `git commit -m "Add new feature"`.
6. Push to the branch: `git push origin feature/new-feature`.
7. Open a pull request, providing a clear title and description of your changes.

### Contribution Guidelines

- Please follow the code style mentioned in this README file.
- Include tests for new features or bug fixes.
- Ensure that your changes do not break existing functionality.

### Reporting Issues

If you encounter any issues or have suggestions for improvements, please open an issue on the [issue tracker](https://github.com/advanced-computer-lab-2023/Sonic-Clinic/issues).

Thank you for contributing to El7a2ny! 🚀



## License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT)

### Third-Party Licenses

Certain components and dependencies used in this project are subject to their own licenses:

- **Stripe:** The use of Stripe is subject to the [Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0). Please review the license terms for more information.

- **Socket.io:** The use of Socket.io is subject to the [MIT License](https://opensource.org/licenses/MIT). Please review the license terms for more information.

- **MongoDB:** The use of MongoDB is subject to the [Server Side Public License (SSPL)](https://www.mongodb.com/licensing/server-side-public-license). Please review the license terms for more information.

- **nodemon:** The use of nodemon is subject to the [MIT License](https://opensource.org/licenses/MIT). Please review the license terms for more information.

- **Redux:** The use of Redux is subject to the [MIT License](https://opensource.org/licenses/MIT). Please review the license terms for more information.

- **Bootstrap:** The use of Bootstrap is subject to the [MIT License](https://opensource.org/licenses/MIT). Please review the license terms for more information.

- **JWT Authentication:** The specific implementation or library used for JWT authentication is subject to its own license. Please review the license terms for more information.

Refer to the respective licenses of these components for details about permissions and restrictions. Ensure compliance with the terms of each license when using or contributing to this project.


