import React, { useState, useRef, useEffect } from "react";
import {
  faMessage,
  faTimes,
  faVideo,
  faArrowLeft,
  faPaperPlane,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Container, ListGroup, Navbar } from "react-bootstrap";
import Peer from "simple-peer";
// import io from "socket.io-client";

// const socket = io.connect("http://localhost:8000");

export default function ChatPat({ who }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [chosen, setChosen] = useState(false);
  const [chosenName, setChosenName] = useState("");
  const [myMessage, setMyMessage] = useState("");

  ////////////////////////////video
  // const [me, setMe] = useState("");
  // const [stream, setStream] = useState();
  // const [receivingCall, setReceivingCall] = useState(false);
  // const [caller, setCaller] = useState("");
  // const [callerSignal, setCallerSignal] = useState();
  // const [callAccepted, setCallAccepted] = useState(false);
  // const [idToCall, setIdToCall] = useState("");
  // const [callEnded, setCallEnded] = useState(false);
  // const [name, setName] = useState("");
  // const myVideo = useRef();
  // const userVideo = useRef();
  // const connectionRef = useRef();

  // useEffect(() => {
  //   navigator.mediaDevices
  //     .getUserMedia({ video: true, audio: true })
  //     .then((stream) => {
  //       setStream(stream);
  //       myVideo.current.srcObject = stream;
  //     });

  //   socket.on("me", (id) => {
  //     setMe(id);
  //   });

  //   socket.on("callUser", (data) => {
  //     setReceivingCall(true);
  //     setCaller(data.from);
  //     setName(data.name);
  //     setCallerSignal(data.signal);
  //   });
  // }, []);

  // const callUser = (id) => {
  //   const peer = new Peer({
  //     initiator: true,
  //     trickle: false,
  //     stream: stream,
  //   });
  //   peer.on("signal", (data) => {
  //     socket.emit("callUser", {
  //       userToCall: id,
  //       signalData: data,
  //       from: me,
  //       name: name,
  //     });
  //   });
  //   peer.on("stream", (stream) => {
  //     userVideo.current.srcObject = stream;
  //   });
  //   socket.on("callAccepted", (signal) => {
  //     setCallAccepted(true);
  //     peer.signal(signal);
  //   });

  //   connectionRef.current = peer;
  // };

  // const answerCall = () => {
  //   setCallAccepted(true);
  //   const peer = new Peer({
  //     initiator: false,
  //     trickle: false,
  //     stream: stream,
  //   });
  //   peer.on("signal", (data) => {
  //     socket.emit("answerCall", { signal: data, to: caller });
  //   });
  //   peer.on("stream", (stream) => {
  //     userVideo.current.srcObject = stream;
  //   });

  //   peer.signal(callerSignal);
  //   connectionRef.current = peer;
  // };

  // const leaveCall = () => {
  //   setCallEnded(true);
  //   connectionRef.current.destroy();
  // };
  /////////////////////////////

  const names = [
    { name: "Doctor", specialty: "Cardio" },
    { name: "Doctor1", specialty: "Cardio" },
    { name: "Doctor2", specialty: "Cardio" },
    { name: "Doctor3", specialty: "Cardio" },
    { name: "Doctor4", specialty: "Cardio" },
    { name: "Doctor4", specialty: "Cardio" },
  ];

  const buttonStyle = {
    position: "fixed",
    bottom: "5rem",
    right: "1rem",
    fontSize: "1.1rem",
    backgroundColor: "transparent",
    border: "none",
    color: "white",
    overflow: "hidden",
    transition: "width 0.3s ease-in-out", // Smooth transition for width change
    width: isHovered ? "13.3rem" : "3rem", // Change width on hover
  };

  const containerStyle = {
    position: "fixed",
    bottom: "5rem",
    right: "1rem",
    fontSize: "1.1rem",
    backgroundColor: "transparent",
    borderRadius: "0.25rem",
    color: "white",
    overflow: "hidden",
    transition: "0.3s ease-in-out", // Smooth transition for width change
    width: "20rem",
    padding: "0rem",
    maxHeight: "30rem",
  };

  const chatContainerStyle = {
    position: "fixed",
    bottom: "5rem",
    right: "1rem",
    fontSize: "1.1rem",
    backgroundColor: "transparent",
    border: "1px solid #f0f0f0",
    borderRadius: "0.25rem",
    color: "white",
    overflow: "hidden",
    transition: "0.3s ease-in-out", // Smooth transition for width change
    width: "20rem",
    padding: "0rem",
    maxHeight: "30rem",
    height: "30rem",
  };

  const buttonContentStyle = {
    display: "flex",
    alignItems: "center",
    position: "relative",
    transition: "0.3s ease-in-out", // Smooth transition for positioning
    left: isHovered ? "-0.3rem" : "0", // Move content to the left on hover
  };

  const myMsg = {
    backgroundColor: "#E0F8F8",
    borderRadius: "0.25rem",
    color: "black",
    display: "inline-block",
    padding: "5px 10px",
    marginBottom: "0.7rem",
    width: "fit-content",
    alignSelf: "flex-end",
  };

  const otherMsg = {
    backgroundColor: "#f0f0f0",
    borderRadius: "0.25rem",
    color: "black",
    display: "inline-block",
    padding: "5px 10px",
    marginBottom: "0.7rem",
    width: "fit-content",
  };

  const inputDiv = {
    marginTop: "auto", // Pushes the input to the bottom
    border: "1px solid #f0f0f0",
    alignSelf: "flex-end", // Aligns the input to the bottom of the container
    display: "flex", // Flex layout
    alignItems: "center", // Vertically align items
    width: "100%",
  };

  const buttonTextPosition = isHovered ? "0" : "-100%";
  const buttonTextOpacity = isHovered ? 1 : 0;

  const chatData = [
    { type: "patient", message: "Hi there!" },
    { type: "doctor", message: "Hello, how can I assist you?" },
    { type: "patient", message: "I'm not feeling well." },
    { type: "doctor", message: "Can you describe your symptoms?" },
    { type: "doctor", message: "Have you taken any medication?" },
    { type: "patient", message: "Not yet." },
  ];

  const sendMessage = () => {
    if (myMessage) {
      console.log(myMessage);
    }
  };

  return (
    <div>
      {!isOpen && (
        <Button
          style={buttonStyle}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={() => setIsOpen(true)}
        >
          <div style={buttonContentStyle}>
            <FontAwesomeIcon
              icon={faMessage}
              style={{ color: "white", marginRight: "5px" }}
            />
            <span
              style={{
                transition: "0.3s ease-in-out", // Smooth transition for text
                transform: `translateX(${buttonTextPosition})`, // Translate text on X-axis
                opacity: buttonTextOpacity,
                whiteSpace: "nowrap",
              }}
            >
              {who === "patient"
                ? "Chat with your doctor"
                : "Chat with your patient"}
            </span>
          </div>
        </Button>
      )}
      {isOpen && (
        <Container
          fluid
          className="d-flex flex-column bg-light"
          style={containerStyle}
        >
          <Navbar
            className="d-flex justify-content-between p-1"
            style={{ backgroundColor: "#05afb9", width: "100%" }}
          >
            <div style={{ color: "white", marginLeft: "1rem" }}>
              {who === "patient" ? "Your Doctors" : "Your Patients"}
            </div>
            <Button
              variant="link"
              onClick={() => {
                setIsOpen(false);
              }}
              style={{ alignSelf: "flex-end" }}
            >
              <FontAwesomeIcon icon={faTimes} style={{ color: "white" }} />
            </Button>
          </Navbar>

          <ListGroup
            as="ol"
            className="flex-grow-1"
            style={{ overflowY: "auto" }}
          >
            {names.map((name, index) => (
              <ListGroup.Item
                key={index}
                as="li"
                className="d-flex justify-content-between align-items-start"
                style={{ cursor: "pointer" }}
                onClick={() => {
                  setChosen(true);
                  setIsOpen(false);
                  setChosenName(name.name);
                }}
              >
                <div className="d-flex flex-column">
                  <div>{name.name}</div>
                  {who === "patient" && (
                    <div
                      style={{
                        fontSize: "1rem",
                        color: "#05afb9",
                        marginLeft: "1rem",
                      }}
                    >
                      {name.specialty}
                    </div>
                  )}
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Container>
      )}
      {chosen && (
        <Container
          fluid
          className="d-flex flex-column bg-white"
          style={chatContainerStyle}
        >
          <Navbar
            className="d-flex justify-content-between p-1"
            style={{ backgroundColor: "#05afb9", width: "100%" }}
          >
            <div>
              {" "}
              <FontAwesomeIcon
                icon={faArrowLeft}
                style={{
                  marginRight: "1rem",
                  marginLeft: "0.2rem",
                  cursor: "pointer",
                }}
                onClick={() => {
                  setChosen(false);
                  setChosenName("");
                  setIsOpen(true);
                }}
              />
              {chosenName}
            </div>
            <div>
              <FontAwesomeIcon icon={faVideo} style={{ cursor: "pointer" }} />
              <Button
                variant="link"
                onClick={() => setChosen(false)}
                style={{ color: "white", alignSelf: "flex-end" }}
              >
                <FontAwesomeIcon icon={faTimes} style={{ cursor: "pointer" }} />
              </Button>
            </div>
          </Navbar>

          <div
            style={{ width: "100%", padding: "10px", overflowY: "auto" }}
            className="d-flex flex-column"
          >
            {chatData.map((item, index) => (
              <div
                key={index}
                className={item.type === "patient" ? "text-end" : "text-start"}
                style={item.type === "patient" ? { ...myMsg } : { ...otherMsg }}
              >
                {item.message}
              </div>
            ))}
          </div>
          <div style={inputDiv} className="d-flex align-items-center">
            <input
              type="text"
              placeholder="Type your message"
              style={{
                flex: "1",
                marginRight: "1rem",
                padding: "5px",
                border: "1px solid transparent",
              }}
              onChange={(e) => setMyMessage(e.target.value)}
            />
            <FontAwesomeIcon
              icon={faPaperPlane}
              style={{
                color: "#05afb9",
                marginRight: "1rem",
                cursor: "pointer",
              }}
              onClick={() => sendMessage()}
            />
          </div>
        </Container>
      )}
    </div>
  );
}
