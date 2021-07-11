//It styles and renders each message in the chatbox before and after video call.

import React from "react";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

//Adding styles
const useStyles = makeStyles({
  root: {
    background: "#5d4037",
    borderRadius: "30px",
    color: "white",
    padding: "15px 15px 5px 15px",
    margin: "10px",
    marginRight: "50px",
    lineHeight: "3px",
    width: "max-content",
    minWidth: "7%",
    maxWidth: "80vw",
    height: "max-content",
  },
  sender: {
    color: "#d7ccc8",
  },
  text: {
    lineHeight: "20px",
  },
});

const RoomMessage = (props) => {
  const classes = useStyles();

  //Renders message
  return (
    <div className={classes.root}>
      <strong className={classes.sender}>{props.sender}</strong>
      <p className={classes.text}>{props.text}</p>
    </div>
  );
};

export default RoomMessage;
