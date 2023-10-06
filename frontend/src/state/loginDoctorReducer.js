import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userName: "",
  firstName: "",
  lastName: "",
  userEmail: "",
  password: "",
  birthdate: "",
  hourlyRate: 0,
  affiliation: "",
  education: "",
  token: "",
  phoneNumber: "",
  userId: "",
  isLoggedIn: false,
};

const loginSlice = createSlice({
  name: "loginDoctor",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.token = action.payload.token;
      state.userName = action.payload.userName;
      state.password = action.payload.password;
      state.birthdate = action.payload.birthdate;
      state.userEmail = action.payload.userEmail;
      state.hourlyRate = action.payload.hourlyRate;
      state.affiliation = action.payload.affiliation;
      state.education = action.payload.education;
      state.firstName = action.payload.firstName;
      state.lastName = action.payload.lastName;
      state.phoneNumber = action.payload.phoneNumber;
      state.userId = action.payload.userId;
      state.isLoggedIn = action.payload.isLoggedIn;
    },
    logout: (state, action) => {
      state.token = "";
      state.firstName = "";
      state.isLoggedIn = false;
      state.lastName = "";
      state.nationality = "";
      state.phoneNumber = "";
      state.userId = "";
    },
    setToken: (state, action) => {
      state.token = action.payload.token;
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

export const { setCredentials, logout, clearPassword, setToken, setUserId } =
  loginSlice.actions;
export default loginSlice.reducer;
