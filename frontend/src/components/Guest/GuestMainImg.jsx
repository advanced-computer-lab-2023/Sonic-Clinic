import { Card, Image } from "react-bootstrap";
import mainImg from "../../Assets/Patient/HomeImg.png";
import { Waypoint } from "react-waypoint";
import { useSpring, animated } from "react-spring";
import { useState } from "react";
function GuestMainImg() {
  const [ourDoctorsVisible, setOurDoctorsVisible] = useState(false);
  const ourDoctorsSpring = useSpring({
    opacity: ourDoctorsVisible ? 1 : 0,
    transform: ourDoctorsVisible ? "translateY(0)" : "translateY(-50%)",
    config: { duration: 500 },
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
            top: "30%",
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
                lineHeight: "100%",
              }}
            >
              Welcome to el7a2ny Clinic!
            </Card.Text>
          </animated.div>
        </Card>
      </Card>
    </div>
  );
}

export default GuestMainImg;
