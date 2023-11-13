import { useNavigate } from "react-router";
import AdminHomeCard from "../Admin/AdminHomeCard";
import {
  faHospitalUser,
  faCalendarCheck,
  faWallet,
} from "@fortawesome/free-solid-svg-icons";
import { Waypoint } from "react-waypoint";
import { useSpring, animated } from "react-spring";
import { useState } from "react";

function DrMainOptions() {
  const navigate = useNavigate();
  const handlePatients = () => {
    navigate("/doctor/doctor-patients");
  };
  const handleAppointments = () => {
    navigate("/doctor/doctor-appointments");
  };
  const [ourDoctorsVisible, setOurDoctorsVisible] = useState(false);
  const ourDoctorsSpring = useSpring({
    opacity: ourDoctorsVisible ? 1 : 0,
    transform: ourDoctorsVisible ? "translateX(0)" : "translateX(-50%)",
    config: { duration: 1000 },
  });

  return (
    <div className="d-flex flex-row justify-content-center">
      <Waypoint
        onEnter={() => setOurDoctorsVisible(true)}
        onLeave={() => setOurDoctorsVisible(false)}
      />
      <animated.div style={ourDoctorsSpring} className="d-flex flex-row">
        <div className="mr-2">
          <AdminHomeCard
            location="/doctor/doctor-patients"
            cardText="Patients"
            cardDetails="View my patients"
            icon={faHospitalUser}
          />
        </div>
        <div>
          <AdminHomeCard
            location="/doctor/doctor-appointments"
            cardText="Appointments"
            cardDetails="View/manage my appointments"
            icon={faCalendarCheck}
          />
        </div>
        <div>
          <AdminHomeCard
            location="/doctor/doctor-profile"
            cardText="Wallet"
            cardDetails="View my wallet"
            icon={faWallet}
          />
        </div>
      </animated.div>
    </div>
  );
}

export default DrMainOptions;
