import React, { useState, useRef, useEffect } from "react";
import {
  faMessage,
  faTimes,
  faVideo,
  faArrowLeft,
  faPaperPlane,
  faCheckDouble,
  faPhone,
  faPhoneSlash,
  faCopy,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Button,
  Container,
  ListGroup,
  Navbar,
  Modal,
  FormControl,
} from "react-bootstrap";
import { CopyToClipboard } from "react-copy-to-clipboard";
import axios from "axios";
import Peer from "simple-peer";
import io from "socket.io-client";

export default function ChatPat({ who }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState(null);
  const [chosen, setChosen] = useState(false);
  const [chosenName, setChosenName] = useState("");
  const [myMessage, setMyMessage] = useState("");
  const [myContacts, setMyContacts] = useState([]);
  const [chatData, setChatData] = useState([]);

  ////////////////////////////video
  const [me, setMe] = useState("");
  const [stream, setStream] = useState();
  const [receivingCall, setReceivingCall] = useState(false);
  const [calling, setCalling] = useState(false);
  const [caller, setCaller] = useState("");
  const [callerSignal, setCallerSignal] = useState();
  const [callAccepted, setCallAccepted] = useState(false);
  const [idToCall, setIdToCall] = useState("");
  const [callEnded, setCallEnded] = useState(false);
  const [name, setName] = useState("");
  const myVideoRef = useRef();
  const userVideoRef = useRef();

  const connectionRef = useRef();
  const socketRef = useRef();

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
    borderRadius: "1rem",
    color: "black",
    display: "inline-block",
    padding: "5px 10px",
    marginBottom: "0.7rem",
    width: "fit-content",
    alignSelf: "flex-end",
  };

  const otherMsg = {
    backgroundColor: "#f0f0f0",
    borderRadius: "1rem",
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

  useEffect(() => {
    fetchData();
  }, []);

  const callUser = (id) => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream,
    });
    peer.on("signal", (data) => {
      socketRef.current.emit("callUser", {
        userToCall: id,
        signalData: data,
        from: me,
        name: name,
      });
    });
    peer.on("stream", (stream) => {
      userVideoRef.current.srcObject = stream;
    });
    socketRef.current.on("callAccepted", (signal) => {
      setCallAccepted(true);
      peer.signal(signal);
    });

    connectionRef.current = peer;
  };

  const answerCall = () => {
    setCallAccepted(true);
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
    });
    peer.on("signal", (data) => {
      socketRef.current.emit("answerCall", { signal: data, to: caller });
    });
    peer.on("stream", (stream) => {
      userVideoRef.current.srcObject = stream;
    });

    peer.signal(callerSignal);
    connectionRef.current = peer;
  };

  const leaveCall = () => {
    setCallEnded(true);
    connectionRef.current.destroy();
  };

  const setChat = (name) => {
    setChosen(true);
    setIsOpen(false);
    setChosenName(name);
    fetchChatData(name);
  };

  const setVideoChat = () => {
    setCalling(true);
  };

  const fetchData = async () => {
    try {
      const response = await axios.post("/viewChats");
      if (response.status === 200) {
        setMyContacts(response.data.chatNames);
      }
    } catch (error) {
      setError(error.response.data.message);
    }
  };

  const fetchChatData = async (name) => {
    const id = name.split("-")[1];
    console.log(id);
    try {
      const response = await axios.post("/viewChat", { _id: id });
      if (response.status === 200) {
        setChatData(response.data.chat.messages);
      }
    } catch (error) {
      setChatData([]);
      setError(error.response.data.message);
    }
  };

  const sendMessage = async () => {
    const id = chosenName.split("-")[1];
    if (myMessage) {
      try {
        const response = await axios.post("/sendMessage", {
          recipientID: id,
          message: myMessage,
        });
        if (response.status === 200) {
          fetchChatData(chosenName);
          setMyMessage("");
        }
      } catch (error) {
        setError(error.response.data.message);
      }
    }
  };

  useEffect(() => {
    socketRef.current = io.connect("http://localhost:8000");
    if (idToCall !== "" && calling) {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          setStream(stream);
          if (myVideoRef.current) {
            myVideoRef.current.srcObject = stream;
          }
        })
        .catch((error) => {
          console.error("Error accessing media devices:", error);
        });

      socketRef.current.on("me", (id) => {
        setMe(id);
        console.log("socket it:", id);
      });

      socketRef.current.on("callUser", (data) => {
        setReceivingCall(true);
        setCaller(data.from);
        setName(data.name);
        setCallerSignal(data.signal);
      });
      callUser(idToCall); // Initiating the call
    }
  }, [idToCall, calling, myVideoRef]);

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
            {myContacts.map((name, index) => (
              <ListGroup.Item
                key={index}
                as="li"
                className="d-flex justify-content-between align-items-start"
                style={{ cursor: "pointer" }}
                onClick={() => {
                  setChat(name);
                  setIdToCall(name.split("-")[1]);
                }}
              >
                <div className="d-flex flex-column">
                  <div>{name.split("-")[0]}</div>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Container>
      )}
      {chosen && (
        <div>
          {" "}
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
                    setChatData([]);
                    setIsOpen(true);
                  }}
                />
                {chosenName.split("-")[0]}
              </div>
              <div>
                <FontAwesomeIcon
                  icon={faVideo}
                  onClick={() => setVideoChat()}
                  style={{ cursor: "pointer" }}
                />
                <Button
                  variant="link"
                  onClick={() => {
                    setChosen(false);
                    setCalling(false);
                  }}
                  style={{ color: "white", alignSelf: "flex-end" }}
                >
                  <FontAwesomeIcon
                    icon={faTimes}
                    style={{ cursor: "pointer" }}
                  />
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
                  className={item[0] === who ? "text-end" : "text-start"}
                  style={item[0] === who ? { ...myMsg } : { ...otherMsg }}
                >
                  <div>{item[3]}</div>
                  <div style={{ fontSize: "0.6rem", textAlign: "end" }}>
                    {item[1].split("-")[2]}
                    {"/"}
                    {item[1].split("-")[1]} {item[2]}
                    {item[0] === who && (
                      <FontAwesomeIcon
                        icon={faCheckDouble}
                        style={{ marginLeft: "0.3rem", color: "#adb5bd " }}
                      />
                    )}
                  </div>
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
                value={myMessage}
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
          <Modal show={calling} style={{ maxWidth: "90%" }}>
            <Modal.Header style={{ fontSize: "1.5rem" }}>
              {chosenName.split("-")[0]}'s Room
            </Modal.Header>
            <Modal.Body className="d-flex flex-column justify-content-center align-items-center">
              <div className="d-flex flex-column">
                <div className="d-flex flex-row" style={{ fontSize: "1.1rem" }}>
                  <strong>Personal key: </strong>
                  {me}{" "}
                  <CopyToClipboard text={me}>
                    <FontAwesomeIcon
                      icon={faCopy}
                      style={{
                        fontSize: "0.9rem",
                        marginLeft: "0.3rem",
                        cursor: "pointer",
                      }}
                    />
                  </CopyToClipboard>
                </div>

                <div className="video" style={{ marginTop: "0.3rem" }}>
                  {stream && (
                    <video
                      playsInline
                      muted
                      ref={myVideoRef}
                      autoPlay
                      style={{ width: "25rem", transform: "scaleX(-1)" }}
                    />
                  )}
                </div>
              </div>

              {/* Render user video when call is accepted */}
              {callAccepted && !callEnded && (
                <div className="d-flex flex-column justify-content-center align-items-center">
                  <video
                    playsInline
                    muted
                    ref={userVideoRef}
                    autoPlay
                    style={{
                      width: "25rem",
                      marginTop: "2rem",
                      transform: "scaleX(-1)",
                      marginLeft: "1rem",
                    }}
                  />
                  <Button
                    variant="secondary"
                    onClick={() => {
                      leaveCall();
                    }}
                    style={{ fontSize: "0.9rem", marginTop: "0.5rem" }}
                  >
                    End Call{" "}
                    <FontAwesomeIcon
                      icon={faPhoneSlash}
                      style={{ fontSize: "0.9rem", marginLeft: "0.3rem" }}
                    />
                  </Button>
                </div>
              )}

              {!receivingCall && !callAccepted && (
                <div
                  className="d-flex justify-content-between"
                  style={{
                    height: "2.5rem",
                    width: "25rem",
                    marginTop: "1rem",
                  }}
                >
                  <FormControl
                    id="filled-basic"
                    label="ID to call"
                    placeholder="Enter key to call"
                    onChange={(e) => setIdToCall(e.target.value)}
                    style={{ width: "18rem" }}
                  />
                  <Button
                    color="primary"
                    onClick={() => callUser(idToCall)}
                    style={{ width: "5rem" }}
                    disabled={idToCall === ""}
                  >
                    Call{" "}
                    <FontAwesomeIcon
                      icon={faPhone}
                      style={{ fontSize: "0.9rem", marginLeft: "0.3rem" }}
                    />
                  </Button>
                </div>
              )}
              {receivingCall && !callAccepted && (
                <Button
                  color="primary"
                  onClick={answerCall}
                  style={{
                    animation: "vibrate 0.5s infinite",
                    // Other button styles
                  }}
                >
                  Answer
                </Button>
              )}
            </Modal.Body>
            <Modal.Footer>
              {" "}
              <Button
                variant="secondary"
                onClick={() => {
                  setCalling(false);
                }}
              >
                Exit room
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      )}
    </div>
  );
}
