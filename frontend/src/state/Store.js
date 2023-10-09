import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import loginPatientReducer from "./loginPatientReducer";
import doctorIdReducer from "./doctorIdReducer";
import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import loginDoctorReducer from "./loginDoctorReducer";
import loginAdminReducer from "./loginAdminReducer";
import SearchDoctor from "./Patient/SearchDoctor";
import filteredDoctors from "./Patient/filteredDoctors";

const persistConfig = {
  key: "root",
  version: 1,
  storage,
};

const rootReducer = combineReducers({
  patientLogin: loginPatientReducer,
  selectedDoctorData: doctorIdReducer,
  doctorLogin: loginDoctorReducer,
  adminLogin: loginAdminReducer,
  searchDoctor: SearchDoctor,
  filterDoctor: filteredDoctors,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export default store;
