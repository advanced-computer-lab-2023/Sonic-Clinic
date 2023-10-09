import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  name: "",
  specialty: "",
};

const searchDoctorSlice = createSlice({
  name: "doctorData",
  initialState,
  reducers: {
    setSearchData: (state, action) => {
      state.name = action.payload.name;
      state.specialty = action.payload.specialty;
    },
    deleteSearchData: (state, action) => {
      state.name = "";
      state.specialty = "";
    },
  },
});

export const { setSearchData, deleteSearchData } = searchDoctorSlice.actions;
export default searchDoctorSlice.reducer;
