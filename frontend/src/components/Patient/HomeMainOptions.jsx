import { Card, Image } from "react-bootstrap";
import { useNavigate } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHandHoldingHeart } from "@fortawesome/free-solid-svg-icons";

function HomeMainOptions() {
  const navigate = useNavigate();
  const handleTransportation = () => {
    navigate("/patient/health-packages");
  };
  return (
    <div
      className="d-flex align-items-center justify-content-between gap-3"
      style={{ marginTop: "1rem" }}
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
        onClick={handleTransportation}
      >
        <div>
          {/* <Image src={packages} style={{ marginTop: "4rem" }} /> */}
          <FontAwesomeIcon
            icon={faHandHoldingHeart}
            style={{ marginBottom: "2rem", color: "#05AFB9", height: "8rem" }}
          />
        </div>
        <div
          style={{
            color: "var(--blue-700, #099BA0)",
            fontSize: "1.5rem",
            fontStyle: "normal",
            fontWeight: "700",
            lineHeight: " 120%",
          }}
        >
          Health Packages
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
          Find your perfect health package
        </div>
      </Card>
    </div>
  );
}

export default HomeMainOptions;
