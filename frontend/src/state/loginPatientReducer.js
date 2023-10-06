import { createSlice } from "@reduxjs/toolkit";


const initialState = {
  userName: "",
  firstName: "",
  lastName: "",
  userEmail: "",
  password: "",
  birthdate: "",
  gender: "",
  phoneNumber: "",
  emergencyName: "",
  emergencyNumber: "",
  token: "",
  userId: "",
  isLoggedIn: false,
};

const loginSlice = createSlice({
  name: "loginPatient",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.token = action.payload.token;
      state.password = action.payload.password;
      state.birthdate = action.payload.birthdate;
      state.userEmail = action.payload.userEmail;
      state.firstName = action.payload.firstName;
      state.lastName = action.payload.lastName;
      state.gender = action.payload.gender;
      state.phoneNumber = action.payload.phoneNumber;
      state.userId = action.payload.userId;
      state.emergencyName = action.payload.emergencyName;
      state.emergencyNumber = action.payload.emergencyNumber;
      state.isLoggedIn = action.payload.isLoggedIn;
    },
    logout: (state, action) => {
      state.userName = "";
      state.firstName = "";
      state.lastName = "";
      state.userEmail = "";
      state.password = "";
      state.birthdate = "";
      state.gender = "";
      state.phoneNumber = "";
      state.emergencyName = "";
      state.emergencyNumber = "";
      state.token = "";
      state.userId = "";
      state.isLoggedIn = false;
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
