//Di zi el main method lama bagy a run ba run el app js 3alatol
//use nodemon badal node 3lashan ma3odsh 22fl w aftah el server kol mara 

// External variables
const express = require("express");
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
require("dotenv").config();
//Declare ll methods el haktbha 
//patientController
const {createPatient} = require("./Controllers/patientController");

//doctorController 
const {createDoctor} = require("./Controllers/doctorController");

//adminstratorController
const {addAdmin,addPackage,addPatient,addDoctor,updatePackage} = require("./Controllers/adminstratorController");

//el link bta3 el DB
const MongoURI = process.env.MONGO_URI ;

                     ///////////////////////////////////////////////////////////////////////////////////////
//App variables
//3lashan a3rf akteb b express
const server = express();
//3lashan lw i am running haga fi el port el awlani yb2a fi option tany 
const port = process.env.PORT || "8000";
//require el models (schema) basamih kol ma aktb user refer to el schema user model 
 const patient = require('./Models/Patient');
 const doctor = require('./Models/Doctor');
 const adminstrator = require('./Models/Adminstrator');
                      //////////////////////////////////////////////////////////////////////////////////////
// configurations
// Mongo DB
mongoose.connect(MongoURI)
.then(()=>{
  console.log("MongoDB is now connected!")
// Starting server
 server.listen(port, () => {
    console.log(`Listening to requests on http://localhost:${port}`);
  })
})
.catch(err => console.log(err));


/*
                                                    Start of your code
*/
server.get("/home", (req, res) => {
    res.status(200).send("You have everything installed!");
  });

// #Routing to userController here
server.use(express.json())

///////////// POST
server.post("/addAdmin",addAdmin);
server.post("/addPatient",addPatient);
server.post("/addDoctor",addDoctor);
////////////// GET
//server.get("/users", getUsers);
//////////////PUT
server.put("/updatePackage", updatePackage);
///////////// UPDATE
//server.delete("/deleteUser", deleteUser);



/*
                                                    End of your code
*/

