import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  username: "",
  name: "",
  email: "",
  dateOfBirth: "",
  hourlyRate: 0,
  affiliation: "",
  educationalBackground: "",
  speciality: "",
  photoLink: "",
};

const doctorIdSlice = createSlice({
  name: "doctorId",
  initialState,
  reducers: {
    setDoctorData: (state, action) => {
      state.username = action.payload.username;
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.dateOfBirth = action.payload.dateOfBirth;
      state.hourlyRate = action.payload.hourlyRate;
      state.affiliation = action.payload.affiliation;
      state.educationalBackground = action.payload.educationalBackground;
      state.speciality = action.payload.speciality;
      state.photoLink = action.payload.photoLink;
    },
  },
});

export const { setDoctorData } = doctorIdSlice.actions;
export default doctorIdSlice.reducer;
