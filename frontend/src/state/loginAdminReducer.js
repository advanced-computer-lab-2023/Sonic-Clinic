import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userName: "admino",
  password: "",
  token: "",
  userId: "",
  isLoggedIn: false,
};

const loginSlice = createSlice({
  name: "loginAdmin",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.token = action.payload.token;
      state.password = action.payload.password;
      state.userName = action.payload.userName;
      state.userId = action.payload.userId;
      state.isLoggedIn = action.payload.isLoggedIn;
    },
    logout: (state, action) => {
        state.userName= "admin";
        state.password= "";
        state.token= "";
        state.userId= "";
        state.isLoggedIn= false;
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
