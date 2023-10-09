import { createSlice } from "@reduxjs/toolkit";
import defaultImg from "../Assets/doctor/UnknownUser.jpg";
const initialState = {
  userName: "",
  name: "",
  email: "",
  password: "",
  birthdate: "",
  hourlyRate: 0,
  affiliation: "",
  education: "",
  phoneNumber: "",
  userId: "",
  patients: [],
  speciality: "",
  photo: { defaultImg },
  isLoggedIn: false,
};

const loginSlice = createSlice({
  name: "loginDoctor",
  initialState,
  reducers: {
    setCredentialsDoctor: (state, action) => {
      state.userName = action.payload.userName;
      state.password = action.payload.password;
      state.birthdate = action.payload.birthdate;
      state.email = action.payload.email;
      state.hourlyRate = action.payload.hourlyRate;
      state.affiliation = action.payload.affiliation;
      state.education = action.payload.education;
      state.name = action.payload.name;
      state.phoneNumber = action.payload.phoneNumber;
      state.userId = action.payload.userId;
      state.patients = action.payload.patients;
      state.speciality = action.payload.speciality;
      state.isLoggedIn = action.payload.isLoggedIn;
    },
    setUpdatesDoctor: (state, action) => {
      state.email = action.payload.email;
      state.hourlyRate = action.payload.hourlyRate;
      state.affiliation = action.payload.affiliation;
    },
    logoutDoctor: (state, action) => {
      state.userName = "";
      state.name = "";
      state.email = "";
      state.password = "";
      state.birthdate = "";
      state.hourlyRate = 0;
      state.affiliation = "";
      state.education = "";
      state.phoneNumber = "";
      state.userId = "";
      state.patients = [];
      state.speciality = "";
      state.isLoggedIn = false;
    },

    clearPasswordDoctor: (state, action) => {
      state = {
        ...state,
        password: "",
      };
    },
    setUserIdDoctor: (state, action) => {
      state = {
        ...state,
        userId: action.payload.userId,
      };
    },
  },
});

export const {
  setCredentialsDoctor,
  setUpdatesDoctor,
  logoutDoctor,
  clearPasswordDoctor,
  setUserIdDoctor,
} = loginSlice.actions;
export default loginSlice.reducer;
