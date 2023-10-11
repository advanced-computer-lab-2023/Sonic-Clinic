import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  name: "",
  specialty: "",
  filterSpecialty: "",
  date: "",
  time: "",
};

const searchDoctorSlice = createSlice({
  name: "doctorData",
  initialState,
  reducers: {
    setSearchData: (state, action) => {
      state.name = action.payload.name;
      state.specialty = action.payload.specialty;
      state.filterSpecialty = action.payload.filterSpecialty;
      state.date = action.payload.date;
      state.time = action.payload.time;
    },
    deleteSearchData: (state, action) => {
      state.name = "";
      state.specialty = "";
      state.filterSpecialty = "";
      state.date = "";
      state.time = "";
    },
  },
});

export const { setSearchData, deleteSearchData } = searchDoctorSlice.actions;
export default searchDoctorSlice.reducer;
