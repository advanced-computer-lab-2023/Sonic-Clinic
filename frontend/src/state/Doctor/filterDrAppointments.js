import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  date: "",
  status: "",
};

const filterDrAppointmentsSlice = createSlice({
  name: "filterDrAppointments",
  initialState,
  reducers: {
    setFilterDrAppointments: (state, action) => {
      state.date = action.payload.date;
      state.status = action.payload.status;
    },
    deleteFilterDrAppointments: (state, action) => {
      state.date = "";
      state.status = "";
    },
  },
});

export const { setFilterDrAppointments, deleteFilterDrAppointments } =
  filterDrAppointmentsSlice.actions;
export default filterDrAppointmentsSlice.reducer;
