//It renders the header on all pages with logout button

import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { useAuth } from "../contexts/AuthProvider";
import { firestore, auth } from "../Firebase";
import firebase from "firebase";
import IconButton from "@material-ui/core/IconButton";
import { useHistory } from "react-router-dom";
import Tooltip from "@material-ui/core/Tooltip";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";

//Adding styles
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  title: {
    flexGrow: 1,
  },
  brown: {
    background: "#3e2723",
  },
  menu: {
    marginTop: "5px",
  },
  accountBtn: {
    color: "white",
  },
  appbar: {
    zIndex: "10",
  },
}));

function Header({ endCall, roomID }) {
  const classes = useStyles();
  const anchorRef = React.useRef(null);
  const [open, setOpen] = React.useState(false);
  const [error, setError] = useState("");
  const { currentUser, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const prevOpen = React.useRef(open);

  //Handles logout using auth provider
  async function handleLogout(e) {
    e.preventDefault();
    try {
      if (endCall) {
        endCall();
      }
      setError("");
      setLoading(true);
      var participant = firestore
        .collection(`Members-${roomID}`)
        .where("name", "==", currentUser.displayName);
      let batch = firestore.batch();
      await participant.get().then((snapShot) => {
        snapShot.docs.forEach((doc) => {
          batch.delete(doc.ref);
        });
      });
      await logout();
      anchorRef.current = null;
      history.push("/login");
    } catch (err) {
      console.log(err);
      setError("Failed to Log Out");
    }
    setLoading(false);
  }

  //Renders all components
  return (
    <div className={classes.root}>
      <AppBar position="fixed" className={classes.appbar}>
        <Toolbar className={classes.brown}>
          <Typography variant="h6" className={classes.title}>
            MS Teams Archer Clone
          </Typography>
          {currentUser && (
            <div>
              <Tooltip title="Log Out">
                <div>
                  <IconButton
                    ref={anchorRef}
                    aria-controls={open ? "menu-list-grow" : undefined}
                    aria-haspopup="true"
                    onClick={handleLogout}
                  >
                    <ExitToAppIcon className={classes.accountBtn} />
                  </IconButton>
                </div>
              </Tooltip>
            </div>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default Header;
