import { Card, Image } from "react-bootstrap";
import mainImg from "../../Assets/Admin/AdminHome.jpg";
import { useSelector } from "react-redux";
import loginAdminReducer from "../../state/loginAdminReducer";
import { Waypoint } from "react-waypoint";
import { useSpring, animated } from "react-spring";
import { useState } from "react";

function AdminImg() {
  const name = useSelector((state) => state.adminLogin.userName);
  const [ourDoctorsVisible, setOurDoctorsVisible] = useState(false);
  const ourDoctorsSpring = useSpring({
    opacity: ourDoctorsVisible ? 1 : 0,
    transform: ourDoctorsVisible ? "translateX(0)" : "translateX(-50%)",
    config: { duration: 1000 },
  });
  return (
    <div>
      <Card
        className="d-flex align-items-center justify-content-center rounded"
        style={{
          width: "100%",
          border: "none",
          position: "relative",
          height: "60vh",
          overflow: "hidden",
        }}
      >
        <Image src={mainImg} style={{ width: "100%" }} />
        <Card
          className="position-absolute text-center bg-transparent"
          style={{
            top: "9%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            border: "none",
          }}
        >
          <Waypoint
            onEnter={() => setOurDoctorsVisible(true)}
            onLeave={() => setOurDoctorsVisible(false)}
          />
          <animated.div style={ourDoctorsSpring} className="d-flex flex-row">
            <Card.Text
              style={{
                color: "#05AFB9",
                textAlign: "center",
                fontFamily: "fantasy",
                fontSize: "7rem",
                fontStyle: "normal",
                fontWeight: 400,
                lineHeight: "120%",
                transform: "translateY(250px)",
              }}
            >
              Hello {name}
            </Card.Text>
          </animated.div>
        </Card>
      </Card>
    </div>
  );
}

export default AdminImg;
