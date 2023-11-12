import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  email: "",
};

const forgotEmailSlice = createSlice({
  name: "forgotEmail",
  initialState,
  reducers: {
    setForgotEmail: (state, action) => {
      state.email = action.payload.email;
    },
    deleteForgotEmail: (state, action) => {
      state.email = "";
    },
  },
});

export const { setForgotEmail, deleteForgotEmail } = forgotEmailSlice.actions;
export default forgotEmailSlice.reducer;
