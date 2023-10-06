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
    setHotelData: (state, action) => {
      state.doctorId = action.payload.hotelId;
      state.doctorName = action.payload.hotelName;
      state.doctorRegion = action.payload.hotelRegion;
      state.doctorImages = action.payload.hotelImages;
      state.doctorStarRating = action.payload.hotelStarRating;
      state.doctorStartPrice = action.payload.hotelStartPrice;
      state.doctorDescription = action.payload.hotelDescription;
    },
  },
});

export const { setDoctorData } = doctorIdSlice.actions;
export default doctorIdSlice.reducer;
