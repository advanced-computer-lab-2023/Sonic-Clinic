import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  filterArray: "",
};

const filterDoctorSlice = createSlice({
  name: "doctorData",
  initialState,
  reducers: {
    setFilterArray: (state, action) => {
      state.filterArray = action.payload.filterArray;
    },
    deleteFilterArray: (state, action) => {
      state.filterArray = "";
    },
  },
});

export const { setFilterArray, deleteFilterArray } = filterDoctorSlice.actions;
export default filterDoctorSlice.reducer;
