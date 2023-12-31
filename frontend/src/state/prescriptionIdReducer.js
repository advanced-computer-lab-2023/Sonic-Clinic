import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  _id: "",
  date: "",
  description: "",
  patientID: "",
  doctorID: 0,
  status: "",
  medicine: [],
  doctorName: "",
};

const prescriptionIdSlice = createSlice({
  name: "prescriptionId",
  initialState,
  reducers: {
    setPrescriptionData: (state, action) => {
      state._id = action.payload._id;
      state.date = action.payload.date;
      state.description = action.payload.description;
      state.patientID = action.payload.patientID;
      state.doctorID = action.payload.doctorID;
      state.status = action.payload.status;
      state.medicine = action.payload.medicine;
      state.doctorName = action.payload.doctorName;
    },
  },
});

export const { setPrescriptionData } = prescriptionIdSlice.actions;
export default prescriptionIdSlice.reducer;
