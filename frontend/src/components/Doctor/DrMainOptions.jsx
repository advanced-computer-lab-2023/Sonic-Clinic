import { Button, Card, Image } from "react-bootstrap";
import { useNavigate } from "react-router";

function DrMainOptions() {
  const navigate = useNavigate();
  const handlePatients = () => {
    navigate("/doctor/doctor-patients");
  };
  const handleAppointments = () => {
    navigate("/doctor/doctor-appointments");
  };

  return (
    <div
      className="d-flex align-items-center justify-content-between gap-3"
      style={{ marginRight: "10rem", marginLeft: "10rem", marginTop: "-8rem" }}
    >
      <Card
        className="p-4 d-flex align-items-center justify-content-center"
        style={{
          borderRadius: "1.5625rem",
          background: "var(--blue-100, #E0F8F8)",
          boxShadow: "0px 4px 4px 0px #05AFB9",
          width: "22.8rem",
          height: "20rem",
          cursor: "pointer",
        }}
        onClick={handlePatients}
      >
        <div
          style={{
            color: "var(--blue-700, #099BA0)",
            fontSize: "1.5rem",
            fontStyle: "normal",
            fontWeight: "700",
            lineHeight: " 120%",
          }}
        >
          Patients
        </div>
        <div
          style={{
            color: "var(--gray-500, #ADB5BD)",
            fontSize: "1rem",
            fontStyle: "normal",
            fontWeight: "400",
            lineHeight: " 120%",
          }}
        >
          View All my Patients
        </div>
      </Card>
      <Card
        className="p-4 d-flex align-items-center justify-content-center"
        style={{
          borderRadius: "1.5625rem",
          background: "var(--blue-100, #E0F8F8)",
          boxShadow: "0px 4px 4px 0px #05AFB9",
          width: "22.8rem",
          height: "20rem",
          cursor: "pointer",
        }}
        onClick={handleAppointments}
      >
        <div
          style={{
            color: "var(--blue-700, #099BA0)",
            fontSize: "1.5rem",
            fontStyle: "normal",
            fontWeight: "700",
            lineHeight: " 120%",
          }}
        >
          Appointments
        </div>
        <div
          style={{
            color: "var(--gray-500, #ADB5BD)",
            fontSize: "1rem",
            fontStyle: "normal",
            fontWeight: "400",
            lineHeight: " 120%",
          }}
        >
          View all my Appointments
        </div>
      </Card>
    </div>
  );
}

export default DrMainOptions;
