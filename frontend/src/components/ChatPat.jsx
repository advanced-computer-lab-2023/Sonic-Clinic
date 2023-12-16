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
  faAnglesRight,
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
    bottom: "3rem",
    right: "1rem",
    fontSize: "1.1rem",
    backgroundColor: "transparent",
    border: "none",
    color: "white",
    overflow: "hidden",
    transition: "width 0.3s ease-in-out", // Smooth transition for width change
    width: isHovered ? (who === "patient" ? "13.5rem" : "5rem") : "3rem", // Change width on hover
  };

  const containerStyle = {
    position: "fixed",
    bottom: "1rem",
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
    bottom: "1rem",
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
    fontSize: "0.98rem",
  };

  const otherMsg = {
    backgroundColor: "#f0f0f0",
    borderRadius: "1rem",
    color: "black",
    display: "inline-block",
    padding: "5px 10px",
    marginBottom: "0.7rem",
    width: "fit-content",
    fontSize: "0.98rem",
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
    setCallEnded(false);
  }, []);

  useEffect(() => {
    socketRef.current = io.connect("http://localhost:8001");
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
    });
    socketRef.current.on("callUser", (data) => {
      setReceivingCall(true);
      setCaller(data.from);
      setName(data.name);
      setCallerSignal(data.signal);
    });
  }, [calling, myVideoRef.current]);

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
    // Destroy the connection
    // connectionRef.current.destroy();
    disconnect2();
  };

  const disconnect2 = () => {
    socketRef.current.emit("disconnectMe", {
      to: idToCall,
    });

    socketRef.current.on("callEnded", () => {
      window.location.reload();
    });

    setIdToCall("");
    // connectionRef.current.destroy();
  };

  // socketRef.current = io.connect("http://localhost:8001");

  // socketRef.current.on("callEnded", () => {
  //   setCallEnded(true);
  // });

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
    let msg = "";
    if (myMessage) {
      msg = myMessage;
    }
    if (calling) {
      msg = "Video key: " + me;
    }
    if (myMessage || calling) {
      try {
        const response = await axios.post("/sendMessage", {
          recipientID: id,
          message: msg,
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

  return (
    <div>
      {!isOpen && (
        <Button
          style={buttonStyle}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={() => setIsOpen(true)}
          variant="secondary"
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
              {who === "patient" ? "Chat with your doctor" : "Chat"}
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
            style={{ backgroundColor: "#ff6b35", width: "100%" }}
          >
            <div style={{ color: "white", marginLeft: "1rem" }}>
              {who === "patient" ? "Your Doctors" : "Your Contacts"}
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
              style={{ backgroundColor: "#ff6b35", width: "100%" }}
            >
              <div style={{ fontSize: "1rem" }}>
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
                  fontSize: "0.98rem",
                }}
                value={myMessage}
                onChange={(e) => setMyMessage(e.target.value)}
              />
              <FontAwesomeIcon
                icon={faPaperPlane}
                style={{
                  color: "#ff6b35",
                  marginRight: "1rem",
                  cursor: "pointer",
                }}
                onClick={() => sendMessage()}
              />
            </div>
          </Container>
          <Modal show={calling} style={{ maxWidth: "90%" }}>
            <Modal.Header>
              <Modal.Title>{chosenName.split("-")[0]}'s Room</Modal.Title>
            </Modal.Header>
            <Modal.Body className="d-flex flex-column justify-content-center align-items-center">
              <div className="d-flex flex-column">
                <div
                  className="d-flex flex-row justify-content-between"
                  style={{ fontSize: "1.1rem" }}
                >
                  <div>
                    <strong>Personal key: </strong>
                    {me}
                  </div>
                  <div
                    style={{
                      fontWeight: "bold",
                      color: "#ff6b35 ",
                      cursor: "pointer",
                    }}
                    onClick={() => sendMessage()}
                  >
                    send{" "}
                    <FontAwesomeIcon
                      icon={faAnglesRight}
                      style={{
                        opacity: 1,
                        color: "#ff6b35 ",
                        fontSize: "15px",
                        transition: "transform 0.3s ease-in-out",
                        marginLeft: "0.3rem",
                        animation:
                          "arrowAnimation2 1s infinite alternate ease-in-out",
                      }}
                    />
                  </div>
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
                    <FontAwesomeIcon
                      icon={faPhoneSlash}
                      style={{ fontSize: "0.9rem" }}
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
                    placeholder="Enter received key to call"
                    onChange={(e) => setIdToCall(e.target.value)}
                    style={{ width: "21rem" }}
                  />
                  <Button
                    color="primary"
                    onClick={() => callUser(idToCall)}
                    style={{ width: "3rem" }}
                    disabled={idToCall === ""}
                  >
                    <FontAwesomeIcon
                      icon={faPhone}
                      style={{ fontSize: "0.9rem" }}
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
