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
  wallet: "0",
  medicalHistory: [],
  isLoggedIn: false,
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
    },
    updatePatientWallet: (state, action) => {
      state.wallet = action.payload.wallet;
    },
    updateMyMedicalHistory: (state, action) => {
      state.medicalHistory = action.payload.medicalHistory;
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
      state.wallet = "0";
      state.medicalHistory = [];
      state.isLoggedIn = false;
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
  updateMyMedicalHistory,
  logoutPatient,
  clearPassword,
  setUserId,
} = loginSlice.actions;
export default loginSlice.reducer;
