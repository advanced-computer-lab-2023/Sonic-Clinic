import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  date: "",
  doctor: "",
  status: "",
};

const filterPrescriptionsSlice = createSlice({
  name: "filterPrescriptions",
  initialState,
  reducers: {
    setFilterPrescriptions: (state, action) => {
      state.date = action.payload.date;
      state.doctor = action.payload.doctor;
      state.status = action.payload.status;
    },
    deleteFilterPrescription: (state, action) => {
      state.date = "";
      state.doctor = "";
      state.status = "";
    },
  },
});

export const { setFilterPrescriptions, deleteFilterPrescription } =
  filterPrescriptionsSlice.actions;
export default filterPrescriptionsSlice.reducer;
