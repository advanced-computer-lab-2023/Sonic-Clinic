import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userName: "",
  password: "",
  userId: "",
  email: "",
  isLoggedIn: false,
};

const loginSlice = createSlice({
  name: "loginAdmin",
  initialState,
  reducers: {
    setCredentialsAdmin: (state, action) => {
      state.password = action.payload.password;
      state.userName = action.payload.userName;
      state.userId = action.payload.userId;
      state.email = action.payload.email;
      state.isLoggedIn = action.payload.isLoggedIn;
    },
    logoutAdmin: (state, action) => {
      state.userName = "";
      state.password = "";
      state.userId = "";
      state.email = "";
      state.isLoggedIn = false;
    },

    clearPasswordAdmin: (state, action) => {
      state = {
        ...state,
        password: "",
      };
    },
    setUserIdAdmin: (state, action) => {
      state = {
        ...state,
        userId: action.payload.userId,
      };
    },
  },
});

export const {
  setCredentialsAdmin,
  logoutAdmin,
  clearPasswordAdmin,
  setUserIdAdmin,
} = loginSlice.actions;
export default loginSlice.reducer;
