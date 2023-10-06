import { Card, Image } from "react-bootstrap";
import mainImg from "../../Assets/Patient/HomeImg.png";

function DrMainImg() {
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
            top: "18%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            border: "none",
          }}
        >
          <Card.Text
            style={{
              color: "#05AFB9",
              textAlign: "center",
              fontFamily: "Vibur",
              fontSize: "7rem",
              fontStyle: "normal",
              fontWeight: 400,
              lineHeight: "120%",
            }}
          >
            Hello Dr.
          </Card.Text>
        </Card>
      </Card>
    </div>
  );
}

export default DrMainImg;