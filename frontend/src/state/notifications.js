import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  newNotifications: false,
};

const notificationsSlice = createSlice({
  name: "loginAdmin",
  initialState,
  reducers: {
    setNewNotifications: (state, action) => {
      state.newNotifications = action.payload.newNotifications;
    },
  },
});

export const { setNewNotifications } = notificationsSlice.actions;
export default notificationsSlice.reducer;
