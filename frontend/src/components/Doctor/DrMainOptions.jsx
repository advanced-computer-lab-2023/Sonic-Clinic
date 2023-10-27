import { useNavigate } from "react-router";
import AdminHomeCard from "../Admin/AdminHomeCard";
import {
  faHospitalUser,
  faCalendarCheck,
  faWallet,
} from "@fortawesome/free-solid-svg-icons";

function DrMainOptions() {
  const navigate = useNavigate();
  const handlePatients = () => {
    navigate("/doctor/doctor-patients");
  };
  const handleAppointments = () => {
    navigate("/doctor/doctor-appointments");
  };

  return (
    <div className="d-flex flex-row justify-content-center">
      <AdminHomeCard
        location="/doctor/doctor-patients"
        cardText="Patients"
        cardDetails="View my patients"
        icon={faHospitalUser}
      />
      <AdminHomeCard
        location="/doctor/doctor-appointments"
        cardText="Appointments"
        cardDetails="View/manage my appointments"
        icon={faCalendarCheck}
      />
      <AdminHomeCard
        location="/doctor/doctor-appointments"
        cardText="Wallet"
        cardDetails="View my wallet"
        icon={faWallet}
      />
    </div>
  );
}

export default DrMainOptions;
