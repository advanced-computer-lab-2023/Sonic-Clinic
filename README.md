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
  - Update personal information.
  
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
  - Add prescriptions with medicines and instructions.
  - View and update prescriptions.
  - Manage medicines within prescriptions.

- **Profile Management:**
  - Change password securely.
  - Update doctor profile details.

- **Upload and Access Documents:**
  - View patient medical history.

### Administrator Features

- **Manage Users:**
  - Add, remove, or update administrators, doctors, and patients.
  - View doctors applications, accept or reject them.

- **View Data:**
  - View all doctors, patients, admins, and appointments.
  - View and manage health packages.


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
  - View individual chats and send messages.
  - Add new chats.

- **Video Chat Functionality:**
  - Users can do video calls.


## Authorization and Security

- **User Authentication  (JWT athentication) :**
  - Implement role-based authentication for patients, doctors, and administrators.
  - Logout securely.

- **Password Management:**
  - Implement password change functionality securely with OTP verification for patients, doctors, and administrators.



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
PORT=8000


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

### 3. Profile Management

- Update your personal information under the "My Profile" section in the menu.
- Change your password securely to by entering your email to recieve an OTP which you will need to enter to be able to type your new password.

### 4. Chatting

- Click on the orange chat icon on the bottom right corner to use the Chat functionality.
- View, create and respond to individual chat messages.

### 5. Log Out

- When done, click on the "Log Out" button in the menu to securely log out of your account.

### 6. Notifications

- Click on the blue bell icon on the bottom right corner to view your notifications.

### Patient:
### 1. View Doctors and Manage Appointments

- Click on "View All Doctors" in the Home Page, filter doctos by speciality, date and time and click on apply or you can search for a doctor by his name. to create a new appointment choose the desired doctor and book a slot.
- To view, reschedule (follow-ups), cancel and filter appointments: Click on the "My Appointments" section in the menu

### 2. Manage Prescriptions

- Access the "Prescriptions" section in the menu to view and filter the prescriptions provided by your doctors.
- Click on a desired prescription to see its detailed information, to buy it and to download it as a pdf.

### 3. Profile

- Access the "My profile" section
- You can click on 'change your password' to update your password, view and add family members, upload and edit helath records and explore and subscribe to available health packages

### Doctor:
### 1. Manage Appointments

- Access "My Appointments" in the menu to view and filter booked appointments by date and time.
- Access "Free slots" inside the "My Appointments" section to add free appointments slots that patients can book.
- Access "Follow-up requests" inside the "My Appointments" section to search and accept or reject follow-ups.

### 2. Manage Patients

- Access the "My Patient" section in the menu to view and filter your patients by appointment status.
- You can search for a patient by his/her name
- Click on a desired patient to see his detailed information, schedule a follow-up for an old appointment, upload his health records, add, view, update and delete prescriptions.

### 3. Profile

- Access the "My profile" section
- You can click on 'change your password'to update your password and you can view your employment contract pdf.



## Screenshots of the System

Access the [Google Drive folder](https://drive.google.com/drive/folders/1Nqq8H35nmAYbNz82tsrXSa3r3NvYQdoi?usp=sharing) to view screenshots of the Sonic-Clinic system.

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

- **CSS:** Our stylesheets adhere to the [BEM (Block, Element, Modifier) methodology](http://getbem.com/) for maintainability and clarity.

- **Naming Conventions:** Descriptive and meaningful variable and function names are encouraged. Please avoid abbreviations when clarity is sacrificed.

- **Indentation:** We use two spaces for indentation in JavaScript and its related files.

- **Comments:** Include comments where necessary to explain complex code sections or to provide context. Follow a consistent comment style.

Before submitting a pull request, please ensure that your code sticks to these conventions. Consistent coding practices enhance collaboration and make the codebase more maintainable.


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


