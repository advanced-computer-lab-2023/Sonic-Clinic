import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userName: "",
  name: "",
  packages: "",
  userEmail: "",
  password: "",
  birthdate: "",
  gender: "",
  phoneNumber: "",
  emergencyName: "",
  emergencyNumber: "",
  userId: "",
  wallet: "",
  medicalHistory: [],
  family: [],
  isLoggedIn: false,
  newPackage: "",
  forFam: "",
  newApp: "",
  newPres: "",
};

const loginSlice = createSlice({
  name: "loginPatient",
  initialState,
  reducers: {
    setCredentialsPatient: (state, action) => {
      state.password = action.payload.password;
      state.userName = action.payload.userName;
      state.birthdate = action.payload.birthdate;
      state.userEmail = action.payload.userEmail;
      state.name = action.payload.name;
      state.packages = action.payload.packages;
      state.gender = action.payload.gender;
      state.phoneNumber = action.payload.phoneNumber;
      state.userId = action.payload.userId;
      state.emergencyName = action.payload.emergencyName;
      state.emergencyNumber = action.payload.emergencyNumber;
      state.medicalHistory = action.payload.medicalHistory;
      state.isLoggedIn = action.payload.isLoggedIn;
      state.wallet = action.payload.wallet;
      state.family = action.payload.family;
    },
    updatePatientWallet: (state, action) => {
      state.wallet = action.payload.wallet;
    },
    updatePatientPackage: (state, action) => {
      state.packages = action.payload.packages;
    },
    cancelPatientPackage: (state, action) => {
      state.packages = "";
    },
    setNewPackage: (state, action) => {
      state.newPackage = action.payload.newPackage;
    },
    removeNewPackage: (state, action) => {
      state.newPackage = "";
    },
    setForFam: (state, action) => {
      state.forFam = action.payload.forFam;
    },
    removeForFam: (state, action) => {
      state.forFam = "";
    },
    setNewApp: (state, action) => {
      state.newApp = action.payload.newApp;
    },
    removeNewApp: (state, action) => {
      state.newApp = "";
    },

    setNewPres: (state, action) => {
      state.newPres = action.payload.newPres;
    },
    removeNewPres: (state, action) => {
      state.newPres = "";
    },

    updateMyMedicalHistory: (state, action) => {
      state.medicalHistory = action.payload.medicalHistory;
    },
    updatePatientFamily: (state, action) => {
      state = {
        ...state,
        family: action.payload.family,
      };
    },
    addFamilyMemberState: (state, action) => {
      state.family = [...state.family, action.payload.family];
    },

    logoutPatient: (state, action) => {
      state.userName = "";
      state.name = "";
      state.packages = "";
      state.userEmail = "";
      state.password = "";
      state.birthdate = "";
      state.gender = "";
      state.phoneNumber = "";
      state.emergencyName = "";
      state.emergencyNumber = "";
      state.userId = "";
      state.wallet = "";
      state.medicalHistory = [];
      state.family = [];
      state.isLoggedIn = false;
      state.newPackage = "";
      state.forFam = "";
      state.newApp = "";
      state.newPres = "";
    },
    clearPassword: (state, action) => {
      state = {
        ...state,
        password: "",
      };
    },
    setUserId: (state, action) => {
      state = {
        ...state,
        userId: action.payload.userId,
      };
    },
  },
});

export const {
  setCredentialsPatient,
  updatePatientWallet,
  updatePatientPackage,
  updateMyMedicalHistory,
  removeNewPackage,
  setNewPackage,
  removeForFam,
  setForFam,
  removeNewApp,
  setNewApp,
  removeNewPres,
  setNewPres,
  logoutPatient,
  clearPassword,
  setUserId,
  updatePatientFamily,
  addFamilyMemberState,
  cancelPatientPackage,
} = loginSlice.actions;
export default loginSlice.reducer;
