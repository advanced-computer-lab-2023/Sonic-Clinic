import { createSlice } from "@reduxjs/toolkit";
// fix change : file name and anything with hotelId name and replace with hotelData
const initialState = {
  doctorId: "",
  doctorName: "",
  doctorRegion: "",
  doctorImages: [],
  doctorStarRating: 0,
  doctorStartPrice: 0,
  doctorDescription: "",
};

const doctorIdSlice = createSlice({
  name: "doctorId",
  initialState,
  reducers: {
    setDoctorData: (state, action) => {
      state.doctorId = action.payload.doctorId;
      state.doctorName = action.payload.doctorName;
      state.doctorRegion = action.payload.doctorRegion;
      state.doctorImages = action.payload.doctorImages;
      state.doctorStarRating = action.payload.doctorStarRating;
      state.doctorStartPrice = action.payload.doctorStartPrice;
      state.doctorDescription = action.payload.doctorDescription;
    },
  },
});

export const { setDoctorData } = doctorIdSlice.actions;
export default doctorIdSlice.reducer;
