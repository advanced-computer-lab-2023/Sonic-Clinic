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
    },
    setFilterData: (state, action) => {
      state.specialty = action.payload.specialty;
      state.date = action.payload.date;
      state.time = action.payload.time;
    },
    deleteSearchData: (state, action) => {
      state.name = "";
      state.specialty = "";
      state.date = "";
      state.time = "";
    },
  },
});

export const { setSearchData, deleteSearchData, setFilterData } =
  searchDoctorSlice.actions;
export default searchDoctorSlice.reducer;
