import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  date: "",
  status: "",
};

const filterAppointmentsSlice = createSlice({
  name: "filterAppointments",
  initialState,
  reducers: {
    setFilterAppointments: (state, action) => {
      state.date = action.payload.date;
      state.status = action.payload.status;
    },
    deleteFilterAppointments: (state, action) => {
      state.date = "";
      state.status = "";
    },
  },
});

export const { setFilterAppointments, deleteFilterAppointments } =
  filterAppointmentsSlice.actions;
export default filterAppointmentsSlice.reducer;
