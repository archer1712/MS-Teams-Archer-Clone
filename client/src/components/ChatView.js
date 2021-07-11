//Renders the page that comes before and after video call in the room

import React, { useState, useEffect, Component } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import CssBaseline from "@material-ui/core/CssBaseline";
import Toolbar from "@material-ui/core/Toolbar";
import Header from "./Header";
import Chatroom from "./Chatroom";
import { firestore, auth } from "../Firebase";
import firebase from "firebase";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";
import Avatar from "@material-ui/core/Avatar";
import Grid from "@material-ui/core/Grid";
import PersonIcon from "@material-ui/icons/Person";

const drawerWidth = "39.5vw";

//Adding styles
const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    alignItems: "flex-end",
    overflow: "hidden",
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    zIndex: "1",
  },
  drawerPaper: {
    width: drawerWidth,
    background: "#795548",
  },
  drawerContainer: {
    overflow: "auto",
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  chatbox: {
    height: "99vh",
    width: "63vw",
    alignSelf: "flex-end",
    border: "solid 2px black",
    overflow: "hidden",
    overflowX: "hidden",
    wordWrap: "break-wrap",
  },
  heading: {
    padding: "20px",
    marginTop: "70px",
    color: "white",
  },
}));

export default function ClippedDrawer(props) {
  const classes = useStyles();
  const roomID = props.match.params.roomID;
  const [participants, setParticipants] = useState([]);

  //Renders all participants list of the room
  useEffect(() => {
    firestore
      .collection(`Members-${roomID}`)
      .limit(4)
      .onSnapshot((snapShot) => {
        setParticipants(snapShot.docs.map((doc) => doc.data()));
      });
  }, []);

  //Renders all components
  return (
    <div className={classes.root}>
      <CssBaseline />
      <Header className={classes.header} roomID={roomID} />
      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.heading}>
          <Typography variant="h4" gutterBottom>
            Team Members
          </Typography>
          <Divider style={{ background: "white" }} />
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <div className={classes.demo}>
                <List>
                  {participants.map((participant) => {
                    {
                      console.log(participant);
                    }
                    return participant ? (
                      <div>
                        <ListItem>
                          <ListItemAvatar>
                            <Avatar>
                              <PersonIcon />
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText primary={participant.name} />
                        </ListItem>
                      </div>
                    ) : (
                      <div></div>
                    );
                  })}
                </List>
              </div>
            </Grid>
          </Grid>
          <Toolbar />
        </div>
      </Drawer>
      <div className={classes.chatbox}>
        <Chatroom roomID={roomID} />
      </div>
    </div>
  );
}
