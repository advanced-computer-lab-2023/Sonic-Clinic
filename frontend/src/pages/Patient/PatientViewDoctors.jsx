import React, { useState, useEffect } from "react";
import { Container, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import AppNavbar from "../../components/AppNavigation/AppNavbar";
import HamburgerMenu from "../../components/Patient/HamburgerMenu";
import DoctorFilter from "../../components/Patient/DoctorFilter";
import ShowDoctors from "../../components/Patient/ShowDoctors";
import ViewDoctorsSearch from "../../components/Patient/ViewDoctorsSearch";
import { deleteSearchData } from "../../state/Patient/SearchDoctor";

function PatientViewDoctors() {
  const dispatch = useDispatch();

  const [responseData, setResponseData] = useState([]);
  const [patients, setPatients] = useState([]); // Updated patients state
  const [error1, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const _id = useSelector((state) => state.patientLogin.userId);
  const searchDataName = useSelector((state) => state.searchDoctor.name);
  const searchDataSpec = useSelector((state) => state.searchDoctor.specialty);

  useEffect(() => {
    fetchData();
  }, [searchDataName, searchDataSpec]); // Updated dependencies

  const fetchData = async () => {
    try {
      const response = await axios.post("/getDOctorsWithSessionPrice");
      if (response.status === 200) {
        setResponseData(response.data.allDoctors);
        const NeededData = response.data.allDoctors;
        const filteredDoctors = NeededData.filter((doctor) => {
          const name = doctor.name ? doctor.name.toLowerCase() : "";
          const speciality = doctor.specialty
            ? doctor.specialty.toLowerCase()
            : "";

          return (
            (searchDataName === "" ||
              name.includes(searchDataName.toLowerCase())) &&
            (searchDataSpec === "" ||
              speciality.includes(searchDataSpec.toLowerCase()))
          );
        });

        // Update the patients state with filtered doctors
        setPatients(filteredDoctors);
      } else {
        console.log("Server error");
      }
      setLoading(false);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setError("No doctors found.");
      } else if (error.response && error.response.status === 500) {
        setError("Server Error");
      } else {
        setError("An error occurred. Please try again later.");
      }
      setLoading(false);
    }
  };

  return (
    <div>
      <AppNavbar hamburgerMenu={<HamburgerMenu />} />
      <Container fluid className="bg-light pt-3 mt-2">
        <Container className="bg-white px-5 py-4 d-flex align-items-center justify-content-center">
          <Row>
            <div>
              <ViewDoctorsSearch />
            </div>
            <div className="col-5">
              <DoctorFilter
                patients={patients}
                responseData={responseData}
                setPatients={setPatients}
              />
            </div>
            <div className="col-7">
              <ShowDoctors
                patients={patients}
                responseData={responseData}
                setPatients={setPatients}
                loading={loading}
                error1={error1}
              />
            </div>
          </Row>
        </Container>
      </Container>
    </div>
  );
}

export default PatientViewDoctors;
