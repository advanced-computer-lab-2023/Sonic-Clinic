import React, { useState } from "react";
import DrShowAppointments from "../../components/Doctor/DrShowAppointments";
import DrAppointmentFilter from "../../components/Doctor/DrAppointmentFilter";
import DrAddAppSlot from "../../components/Doctor/DrAddAppSlot";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";

function DrViewApps() {
  const [responseData, setResponseData] = useState([]);
  const [error, setError] = useState(null);
  const _id = useSelector((state) => state.doctorLogin.userId);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    const config = {
      headers: {
        _id: _id,
      },
    };
    console.log(_id);
    try {
      const response = await axios.post("/viewDocApp", { _id: _id }, config);
      if (response.status === 200) {
        setResponseData(response.data);
      } else {
        console.log("Server error");
      }
      setLoading(false);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setError("No data found.");
      } else if (error.response && error.response.status === 500) {
        setError("Server Error");
      }
      setLoading(false);
    }
  };
  const appointments = responseData;

  return (
    <>
      <div className="col-5">
        <DrAddAppSlot fetchData={fetchData} />
        <div className="my-5">
          <DrAppointmentFilter />
        </div>
      </div>
      <div className="col-7">
        <DrShowAppointments
          fetchData={fetchData}
          appointments={appointments}
          loading={loading}
        />
      </div>
    </>
  );
}

export default DrViewApps;
