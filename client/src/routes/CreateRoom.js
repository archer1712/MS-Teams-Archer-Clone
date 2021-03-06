//It renders the dashboard after login, giving options for creating or joining room

import React, { useState } from "react";
import { v1 as uuid } from "uuid";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { useAuth } from "../contexts/AuthProvider";
import { firestore, auth } from "../Firebase";
import firebase from "firebase";
import Header from "../components/Header";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Grow from "@material-ui/core/Grow";
import Paper from "@material-ui/core/Paper";
import Popper from "@material-ui/core/Popper";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

//Adding Styles
const useStyles = makeStyles((theme) => ({
  giveBackground: {
    background: "#795548",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
  },
  root: {
    "& > *": {
      margin: theme.spacing(1),
      justifyContent: "center",
    },
  },
  headings: {
    color: "white",
    display: "flex",
    justifyContent: "center",
    textAlign: "center",
    paddingBottom: "25px",
  },
  roomChange: {
    "& .Mui-focused": {
      color: "#3e2723",
    },
    "& label.Mui-focused": {
      color: "#3e2723",
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: "#3e2723",
    },
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "#3e2723",
      },
      "&:hover fieldset": {
        borderColor: "#3e2723",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#3e2723",
      },
    },
  },
}));

const CreateRoom = (props) => {
  const classes = useStyles();
  const { currentUser } = useAuth();
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);
  const [dialogueOpen, setDialogueOpen] = React.useState(false);
  const [inputID, setInputID] = useState("");

  const handleRoomChange = (e) => {
    setInputID(e.target.value);
  };

  //Adds the user to the list of users present in the room he is joining
  async function addUsertoRoom(roomID) {
    await firestore.collection(`Members-${roomID}`).add({
      name: currentUser.displayName,
    });
  }

  //Handles join room and redirects to that room
  const handleJoinRoom = () => {
    setDialogueOpen(false);
    setOpen(false);
    addUsertoRoom(inputID);
    props.history.push(`/chatview/${inputID}`);
  };

  //Opens the Join room dialogue
  const handleDialogueOpen = () => {
    setDialogueOpen(true);
  };

  //Closes the Join room dialogue
  const handleDialogueClose = () => {
    setDialogueOpen(false);
  };

  //Toggles the join room dialogue
  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  //Handles drop down menu toggle on clicking Get Started button
  function handleListKeyDown(event) {
    if (event.key === "Tab") {
      event.preventDefault();
      setOpen(false);
    }
  }

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = React.useRef(open);
  React.useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);

  //Creates new room with random url and redirects to the room
  function create() {
    const id = uuid();
    setOpen((prevOpen) => !prevOpen);
    console.log(id);
    addUsertoRoom(id);
    props.history.push(`/chatview/${id}`);
  }

  //Renders all components on screen
  return (
    <div>
      <Header />
      <div className={classes.giveBackground}>
        <div className={classes.root}>
          <Typography variant="h3" className={classes.headings}>
            Hii {currentUser.displayName}! Welcome to MS Teams Archer Clone
          </Typography>
          <Typography variant="h5" className={classes.headings}>
            Press the button below to get started!
          </Typography>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Button
              variant="contained"
              ref={anchorRef}
              aria-controls={open ? "menu-list-grow" : undefined}
              aria-haspopup="true"
              onClick={handleToggle}
              style={{ color: "white", background: "#4caf50", display: "flex" }}
            >
              Get Started
            </Button>
            <Popper
              open={open}
              anchorEl={anchorRef.current}
              role={undefined}
              transition
              disablePortal
            >
              {({ TransitionProps, placement }) => (
                <Grow
                  {...TransitionProps}
                  style={{
                    transformOrigin:
                      placement === "bottom" ? "center top" : "center bottom",
                  }}
                >
                  <Paper>
                    <ClickAwayListener onClickAway={handleClose}>
                      <MenuList
                        autoFocusItem={open}
                        id="menu-list-grow"
                        onKeyDown={handleListKeyDown}
                      >
                        <MenuItem onClick={create}>Create a New Room</MenuItem>
                        <MenuItem onClick={handleDialogueOpen}>
                          Join a room
                        </MenuItem>
                        <Dialog
                          open={dialogueOpen}
                          onClose={handleDialogueClose}
                          aria-labelledby="form-dialog-title"
                          className={classes.roomChange}
                        >
                          <DialogTitle id="form-dialog-title">
                            Join a Video Call
                          </DialogTitle>
                          <DialogContent>
                            <DialogContentText>
                              To join a room, please enter it's joining MSAC
                              code below and press on the join room button.
                            </DialogContentText>
                            <TextField
                              autoFocus
                              margin="dense"
                              id="name"
                              label="MSAC Room Code"
                              onChange={handleRoomChange}
                              className={classes.roomChange}
                              fullWidth
                            />
                          </DialogContent>
                          <DialogActions>
                            <Button onClick={handleDialogueClose}>
                              Cancel
                            </Button>
                            <Button onClick={handleJoinRoom}>Join Room</Button>
                          </DialogActions>
                        </Dialog>
                      </MenuList>
                    </ClickAwayListener>
                  </Paper>
                </Grow>
              )}
            </Popper>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateRoom;
