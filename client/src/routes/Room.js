/*This file renders the video call feature, along with audio video toggles, chat within the meet,
Present screen option and Info and Invite windows */

import React, { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import io from "socket.io-client";
import Peer from "simple-peer";
import styled from "styled-components";
import { makeStyles } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import MicIcon from "@material-ui/icons/Mic";
import MicOffIcon from "@material-ui/icons/MicOff";
import VideocamIcon from "@material-ui/icons/Videocam";
import VideocamOffIcon from "@material-ui/icons/VideocamOff";
import ScreenShareIcon from "@material-ui/icons/ScreenShare";
import StopScreenShareIcon from "@material-ui/icons/StopScreenShare";
import Drawer from "@material-ui/core/Drawer";
import CssBaseline from "@material-ui/core/CssBaseline";
import Divider from "@material-ui/core/Divider";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import IconButton from "@material-ui/core";
import ChatIcon from "@material-ui/icons/Chat";
import { withTheme } from "../components/Theme";
import socket from "socket.io-client/lib/socket";
import { firestore } from "../Firebase";
import Chatbox from "../components/Chatbox";
import CallEndIcon from "@material-ui/icons/CallEnd";
import { useHistory } from "react-router";
import Tooltip from "@material-ui/core/Tooltip";
import InfoIcon from "@material-ui/icons/Info";
import Info from "../components/Info";
import EmailOutlinedIcon from "@material-ui/icons/EmailOutlined";
import Invite from "../components/Invite";
import PeopleIcon from "@material-ui/icons/People";
import People from "@material-ui/icons/People";
import { useAuth } from "../contexts/AuthProvider";
import Header from "../components/Header";

var userStream = null;
const drawerWidth = "23%";

//Adding styles
const useStyles = makeStyles((theme) => ({
  giveBackground: {
    background: "#795548",
    marginTop: "8vh",
    height: "82vh",
    maxHeight: "95%",
  },
  buttonGroup: {
    height: "10vh",
    background: "#795548",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    "& > *": {
      margin: theme.spacing(1),
    },
  },
  mediaButton: {
    height: theme.spacing(6),
    width: theme.spacing(6),
    padding: theme.spacing(3),
  },
  mediaIcon: {
    height: theme.spacing(5),
    width: theme.spacing(5),
    color: "white",
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
}));

const Container = styled.div`
  padding: 2px;
  display: flex;
  height: 82vh;
  width: 85%;
  margin: auto;
  flex-wrap: wrap;
`;

const StyledVideo = styled.video`
  height: 45%;
  width: 45%;
  border-radius: 10px;
  border: 5px solid #ffffff;
  margin: 10px;
`;

const Video = (props) => {
  const ref = useRef();

  useEffect(() => {
    props.peer.on("stream", (stream) => {
      ref.current.srcObject = stream;
    });
  }, []);

  return <StyledVideo controls playsInline autoPlay ref={ref} />;
};

const videoConstraints = {
  height: window.innerHeight / 2,
  width: window.innerWidth / 2,
};

const Room = (props) => {
  const classes = useStyles();
  const [peers, setPeers] = useState([]);
  const socketRef = useRef();
  const userVideo = useRef();
  const peersRef = useRef([]);
  const roomID = props.match.params.roomID;
  const [currentID, setCurrentID] = useState();
  const [audioShare, setAudioShare] = useState(true);
  const [videoShare, setVideoShare] = useState(true);
  const [screenShare, setScreenShare] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const screenRef = useRef();
  const myPeer = useRef();
  const history = useHistory();
  const [infoOpen, setInfoOpen] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);
  const { currentUser } = useAuth();
  const [participantsList, setParticipantsList] = useState([]);

  var connectionOptions = {
    "force new connection": true,
    reconnectionAttempts: "Infinity",
    timeout: 10000,
    transports: ["websocket"],
  };

  //Handles and fires socket events
  useEffect(() => {
    socketRef.current = io.connect("http://localhost:8000/", {
      withCredentials: false,
    });
    navigator.mediaDevices
      .getUserMedia({ video: videoConstraints, audio: true })
      .then((stream) => {
        userVideo.current.srcObject = stream;
        userStream = stream;
        const newParticipantsList = [
          ...participantsList,
          currentUser.displayName,
        ];
        setParticipantsList(newParticipantsList);
        const joinData = {
          roomID: roomID,
          user: currentUser.displayName,
        };
        socketRef.current.emit("join room", roomID);
        socketRef.current.on(
          "all users",
          (users) => {
            const peers = [];
            users.forEach((userID) => {
              console.log(userID);
              const peer = createPeer(userID, socketRef.current.id, stream);
              peersRef.current.push({
                peerID: userID,
                peer,
              });
              peers.push({
                peerID: userID,
                peer,
              });
            });
            setPeers(peers);
          },
          []
        );

        socketRef.current.on("user joined", (payload) => {
          const peer = addPeer(payload.signal, payload.callerID, stream);
          myPeer.current = peer;
          peersRef.current.push({
            peerID: payload.callerID,
            peer,
          });
          const peerObj = {
            peer,
            peerID: payload.callerID,
          };
          setPeers((users) => [...users, peerObj]);
        });

        socketRef.current.on("receiving returned signal", (payload) => {
          const item = peersRef.current.find((p) => p.peerID === payload.id);
          item.peer.signal(payload.signal);
        });
        myPeer.current = peersRef[0];

        socketRef.current.on("user left", (id) => {
          const peerLeaving = peersRef.current.find((p) => p.peerID === id);
          if (peerLeaving) {
            peerLeaving.peer.destroy();
          }
          const newPeers = peersRef.current.filter((p) => p.peerID !== id);
          peersRef.current = newPeers;
          setPeers(newPeers);
        });
      });
  }, []);

  //Creates peer connection between two users
  function createPeer(userToSignal, callerID, stream) {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream,
    });

    peer.on("signal", (signal) => {
      socketRef.current.emit("sending signal", {
        userToSignal,
        callerID,
        signal,
      });
    });

    return peer;
  }

  function addPeer(incomingSignal, callerID, stream) {
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream,
    });

    peer.on("signal", (signal) => {
      socketRef.current.emit("returning signal", { signal, callerID });
    });

    peer.signal(incomingSignal);

    return peer;
  }

  //Handles Audio Toggle
  const toggleAudioShare = (value) => {
    const myAudio = userStream.getAudioTracks()[0];
    myAudio.enabled = !myAudio.enabled;
    setAudioShare(value);
  };

  //Handles Video Toggle
  const toggleVideoShare = (value) => {
    const myVideo = userStream.getVideoTracks()[0];
    myVideo.enabled = !myVideo.enabled;
    setVideoShare(value);
  };

  //Opens chat window
  const toggleChatOpen = (value) => {
    setInviteOpen(false);
    setInfoOpen(false);
    setChatOpen(value);
  };

  //Handles screen sharing
  const toggleScreenShare = (value) => {
    if (!screenShare) {
      navigator.mediaDevices
        .getDisplayMedia({ cursor: true })
        .then((screenStream) => {
          setScreenShare(value);
          const screen = screenStream.getVideoTracks()[0];
          screenRef.current = screenStream.getVideoTracks()[0];
          peersRef.current.forEach(({ peer }) => {
            const v = peer.streams[0].getVideoTracks();
            console.log(
              peer.streams[0]
                .getTracks()
                .find((track) => track.kind === "video")
            );
            peer.replaceTrack(
              peer.streams[0]
                .getTracks()
                .find((track) => track.kind === "video"),
              screen,
              userStream
            );
          });
          userVideo.current.srcObject = screenStream;
        });

      window.screen.onended = () => {
        peersRef.current.forEach(({ peer }) => {
          peer.replaceTrack(
            screenRef.current,
            peer.streams[0].getTracks().find((track) => track.kind === "video"),
            userStream
          );
        });
      };
    } else {
      window.screen.onended();
      userVideo.current.srcObject = userStream;
      setScreenShare(value);
    }
  };

  //Ends call and returns to chat
  const endCall = () => {
    socketRef.current.disconnect();
    history.push(`/chatview/${roomID}`);
  };

  //Handles Info window toggle
  const toggleInfoOpen = () => {
    setInviteOpen(false);
    setChatOpen(false);
    setInfoOpen(!infoOpen);
  };

  //Handles invite window toggle
  const toggleInviteOpen = () => {
    setChatOpen(false);
    setInfoOpen(false);
    setInviteOpen(!inviteOpen);
  };

  //Renders all components on screen
  return (
    <div>
      <Header endCall={endCall} roomID={roomID} />
      <div className={classes.giveBackground}>
        <Container>
          <StyledVideo muted ref={userVideo} controls autoPlay playsInline />
          {peers.map((peer) => {
            return (
              <>
                <Video key={peer.peerID} peer={peer.peer} />
              </>
            );
          })}
        </Container>
      </div>
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="right"
        open={chatOpen}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerHeader}>
          <Button
            onClick={() => {
              toggleChatOpen(!chatOpen);
            }}
          >
            <ChevronRightIcon />
          </Button>
        </div>
        <Divider />
        <Chatbox roomID={roomID} />
        <Divider />
      </Drawer>

      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="right"
        open={infoOpen}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerHeader}>
          <Button
            onClick={() => {
              toggleInfoOpen();
            }}
          >
            <ChevronRightIcon />
          </Button>
        </div>
        <Divider />
        <Info roomID={roomID} />
        <Divider />
      </Drawer>

      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="right"
        open={inviteOpen}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerHeader}>
          <Button
            onClick={() => {
              toggleInviteOpen();
            }}
          >
            <ChevronRightIcon />
          </Button>
        </div>
        <Divider />
        <Invite roomID={roomID} />
        <Divider />
      </Drawer>

      <div className={classes.buttonGroup}>
        <ButtonGroup color="white" aria-label="outlined primary button group">
          {!audioShare && (
            <Tooltip title="Turn on your audio">
              <span>
                <Button
                  className={classes.mediaButton}
                  onClick={() => {
                    toggleAudioShare(!audioShare);
                  }}
                >
                  {<MicOffIcon className={classes.mediaIcon} />}
                </Button>
              </span>
            </Tooltip>
          )}
          {audioShare && (
            <Tooltip title="Turn off your audio">
              <span>
                {
                  <Button
                    className={classes.mediaButton}
                    onClick={() => {
                      toggleAudioShare(!audioShare);
                    }}
                  >
                    {<MicIcon className={classes.mediaIcon} />}
                  </Button>
                }
              </span>
            </Tooltip>
          )}
          {!videoShare && (
            <Tooltip title="Turn on your video">
              <span>
                {!videoShare && (
                  <Button
                    className={classes.mediaButton}
                    onClick={() => {
                      toggleVideoShare(!videoShare);
                    }}
                  >
                    {<VideocamOffIcon className={classes.mediaIcon} />}
                  </Button>
                )}
              </span>
            </Tooltip>
          )}
          {videoShare && (
            <Tooltip title="Turn off your video">
              <span>
                {videoShare && (
                  <Button
                    className={classes.mediaButton}
                    onClick={() => {
                      toggleVideoShare(!videoShare);
                    }}
                  >
                    {<VideocamIcon className={classes.mediaIcon} />}
                  </Button>
                )}
              </span>
            </Tooltip>
          )}
          {!screenShare && (
            <Tooltip title="Share screen">
              <span>
                {!screenShare && (
                  <Button
                    className={classes.mediaButton}
                    onClick={() => {
                      toggleScreenShare(!screenShare);
                    }}
                  >
                    {<ScreenShareIcon className={classes.mediaIcon} />}
                  </Button>
                )}
              </span>
            </Tooltip>
          )}
          {screenShare && (
            <Tooltip title="Stop sharing your screen">
              <span>
                {screenShare && (
                  <Button
                    className={classes.mediaButton}
                    onClick={() => {
                      toggleScreenShare(!screenShare);
                    }}
                  >
                    {<StopScreenShareIcon className={classes.mediaIcon} />}
                  </Button>
                )}
              </span>
            </Tooltip>
          )}
          <Tooltip title="Toggle Chatbox">
            <span>
              <Button
                className={classes.mediaButton}
                onClick={() => {
                  toggleChatOpen(!chatOpen);
                }}
              >
                {<ChatIcon className={classes.mediaIcon} />}
              </Button>
            </span>
          </Tooltip>
          <Tooltip title="End Call">
            <span>
              <Button
                className={classes.mediaButton}
                onClick={() => {
                  endCall();
                }}
              >
                {<CallEndIcon className={classes.mediaIcon} />}
              </Button>
            </span>
          </Tooltip>
          <Tooltip title="Call Info">
            <span>
              <Button
                className={classes.mediaButton}
                onClick={() => {
                  toggleInfoOpen();
                }}
              >
                {<InfoIcon className={classes.mediaIcon}></InfoIcon>}
              </Button>
            </span>
          </Tooltip>
          <Tooltip title="Send Invite via Mail">
            <span>
              <Button
                className={classes.mediaButton}
                onClick={() => {
                  toggleInviteOpen();
                }}
              >
                {
                  <EmailOutlinedIcon
                    className={classes.mediaIcon}
                  ></EmailOutlinedIcon>
                }
              </Button>
            </span>
          </Tooltip>
        </ButtonGroup>
      </div>
    </div>
  );
};

export default Room;
