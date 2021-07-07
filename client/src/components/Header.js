import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { useAuth } from "../contexts/AuthProvider";
import { firestore, auth } from '../Firebase';
import firebase from 'firebase';
import IconButton from '@material-ui/core/IconButton';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import { useHistory } from 'react-router-dom';
import Tooltip from '@material-ui/core/Tooltip';
import Button from '@material-ui/core/Button';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuList from '@material-ui/core/MenuList';
import { Icon } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  title: {
    flexGrow: 1
  },
  brown: {
    background: '#3e2723'
  },
  menu: {
    marginTop: '5px'
  },
  accountBtn: {
    color: 'white',
  },
  appbar: {
    zIndex: '10'
  }
}));

function Header({endCall, roomID}) {
  const classes = useStyles();
  const anchorRef = React.useRef(null);
  const [open, setOpen] = React.useState(false);
  const [error, setError] = useState("")
  const { currentUser, logout } = useAuth()
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const prevOpen = React.useRef(open);

  async function handleLogout(e) {
    e.preventDefault()
    try {
      if(endCall){endCall()}
      setError("")
      setLoading(true)
      var participant = firestore.collection(`Members-${roomID}`).where('name','==',currentUser.displayName);
      let batch = firestore.batch();
      await participant.get().then(snapShot => {
        snapShot.docs.forEach(doc => {
          batch.delete(doc.ref);
        })
      })
      await logout()
      anchorRef.current = null;
      history.push("/login")
    } catch(err) {
      console.log(err);
      setError("Failed to Log Out")
    }
    setLoading(false)
  }

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  function handleListKeyDown(event) {
    if (event.key === 'Tab') {
      event.preventDefault();
      setOpen(false);
    }
  }


  return (
    <div className={classes.root} >
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
                aria-controls={open ? 'menu-list-grow' : undefined}
                aria-haspopup="true"
                onClick={handleToggle}
              >
                <AccountCircle className={classes.accountBtn} />
              </IconButton>
              <Popper open={open} anchorEl={anchorRef.current} role={undefined} transition disablePortal>
                {({ TransitionProps, placement }) => (
                  <Grow
                    {...TransitionProps}
                    style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
                  >
                    <Paper>
                      <ClickAwayListener onClickAway={handleClose}>
                        <MenuList autoFocusItem={open} id="menu-list-grow" onKeyDown={handleListKeyDown}>
                          <MenuItem onClick={handleLogout}>Logout</MenuItem>
                        </MenuList>
                      </ClickAwayListener>
                    </Paper>
                  </Grow>
                )}
              </Popper>
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