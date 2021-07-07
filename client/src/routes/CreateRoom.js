import React, { useState } from "react";
import { v1 as uuid } from "uuid";
import { makeStyles } from "@material-ui/core/styles";
import Button from '@material-ui/core/Button';
import  Typography  from "@material-ui/core/Typography";
import { useAuth } from "../contexts/AuthProvider";
import { firestore, auth } from '../Firebase';
import firebase from 'firebase';
import Header from '../components/Header';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const useStyles = makeStyles((theme) => ({
    giveBackground: {
        background: '#795548',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh'
    },
    root: {
        '& > *': {
          margin: theme.spacing(1),
          justifyContent: 'center'
        }
      },
    headings: {
        color: 'white',
        display: 'flex',
        justifyContent: 'center',
        textAlign: 'center',
        paddingBottom: '25px'
    }
  }));

const CreateRoom = (props) => {
    const classes = useStyles();
    const { currentUser } = useAuth();
    const [open, setOpen] = React.useState(false);
    const anchorRef = React.useRef(null);
    const [dialogueOpen, setDialogueOpen] = React.useState(false);
    const [inputID, setInputID] = useState('');

    const handleRoomChange = (e) => {
        setInputID(e.target.value);
    }

    async function addUsertoRoom(roomID) {
        await firestore.collection(`Members-${roomID}`).add({
            name: currentUser.displayName
        })
    }

    const handleJoinRoom = () => {
        setDialogueOpen(false);
        setOpen(false);
        addUsertoRoom(inputID);
        props.history.push(`/chatview/${inputID}`);
        // props.history.push(`/room/${inputID}`)
    }

    const handleDialogueOpen = () => {
        setDialogueOpen(true);
      };
    
      const handleDialogueClose = () => {
        setDialogueOpen(false);
      };

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

    // return focus to the button when we transitioned from !open -> open
    const prevOpen = React.useRef(open);
    React.useEffect(() => {
    if (prevOpen.current === true && open === false) {
        anchorRef.current.focus();
    }

    prevOpen.current = open;
    }, [open]);
    

    function create() {
        const id = uuid();
        setOpen((prevOpen) => !prevOpen);
        console.log(id);
        addUsertoRoom(id);
        props.history.push(`/chatview/${id}`)
        // props.history.push(`/chat/${id}`);
        // props.history.push(`/room/${id}`);
    }

    return (
        <div>
            <Header />
        <div className={classes.giveBackground}>
            <div className={classes.root}>
            <Typography variant="h3" className={classes.headings}>Hii {currentUser.displayName}! Welcome to MS Teams Archer Clone</Typography>
            <Typography variant="h5" className={classes.headings}>Press the button below to get started on an instant video call.</Typography>
                <div style={{display: 'flex', justifyContent: 'center'}}>
                    <Button variant="contained" ref={anchorRef} aria-controls={open ? 'menu-list-grow' : undefined} 
                    aria-haspopup="true" onClick={handleToggle} style={{color: 'white', background: '#4caf50', display: 'flex'}}>
                        Get Started
                    </Button>
                    <Popper open={open} anchorEl={anchorRef.current} role={undefined} transition disablePortal>
                    {({ TransitionProps, placement }) => (
                        <Grow
                        {...TransitionProps}
                        style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
                        >
                        <Paper>
                            <ClickAwayListener onClickAway={handleClose}>
                            <MenuList autoFocusItem={open} id="menu-list-grow" onKeyDown={handleListKeyDown}>
                                <MenuItem onClick={create}>Create a New Room</MenuItem>
                                <MenuItem onClick={handleDialogueOpen}>Join a room</MenuItem>
                                <Dialog open={dialogueOpen} onClose={handleDialogueClose} aria-labelledby="form-dialog-title">
                                    <DialogTitle id="form-dialog-title">Join a Video Call</DialogTitle>
                                    <DialogContent>
                                    <DialogContentText>
                                        To join a room, please enter it's joining MSAC code below and press on the join room button.
                                    </DialogContentText>
                                    <TextField
                                        autoFocus
                                        margin="dense"
                                        id="name"
                                        label="MSAC Room Code"
                                        onChange={handleRoomChange}
                                        // type="email"
                                        fullWidth
                                    />
                                    </DialogContent>
                                    <DialogActions>
                                    <Button onClick={handleDialogueClose} color="primary">
                                        Cancel
                                    </Button>
                                    <Button onClick={handleJoinRoom} color="primary">
                                        Join Room
                                    </Button>
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
