import { Card, Image } from "react-bootstrap";
import mainImg from "../../Assets/Admin/adminHome1.png";
import { useSelector } from "react-redux";
import { Waypoint } from "react-waypoint";
import { useSpring, animated } from "react-spring";
import { useState } from "react";

function AdminImg() {
  const name = useSelector((state) => state.adminLogin.name);
  const [ourDoctorsVisible, setOurDoctorsVisible] = useState(false);
  const ourDoctorsSpring = useSpring({
    opacity: ourDoctorsVisible ? 1 : 0,
    transform: ourDoctorsVisible ? "translateY(0)" : "translateY(-40%)",
    config: { duration: 800 },
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
                color: "#099BA0 ",
                textAlign: "center",
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "6rem",
                fontStyle: "normal",
                fontWeight: 700,
                lineHeight: "120%",
                transform: "translateY(200px)",
                background:
                  "radial-gradient(circle, rgba(128, 128, 128, 0.5), rgba(128, 128, 128, 0.1))",
                borderRadius: "1rem",
              }}
            >
              Hello {name.split(" ").length > 1 ? name.split(" ")[0] : name}
            </Card.Text>
          </animated.div>
        </Card>
      </Card>
    </div>
  );
}

export default AdminImg;
