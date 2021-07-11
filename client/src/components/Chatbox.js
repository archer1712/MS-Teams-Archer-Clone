//It renders the chat box during the video call only

import React, { useState, useEffect, Component } from "react";
import { makeStyles } from "@material-ui/styles";
import { Input, TextField } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import SendIcon from "@material-ui/icons/Send";
import { message } from "statuses";
import { firestore, auth } from "../Firebase";
import Message from "./Message";
import firebase from "firebase";
import { withTheme } from "./Theme";
import "emoji-mart/css/emoji-mart.css";
import { Picker } from "emoji-mart";
import EmojiEmotionsIcon from "@material-ui/icons/EmojiEmotions";
import emoji from "emoji-mart/dist-es/components/emoji/emoji";

//Adding styles
const useStyles = makeStyles((theme) => ({
  chatbox: {
    height: "94%",
  },
  msgCollection: {
    minWidth: "85%",
    alignSelf: "flex-start",
    overflow: "scroll",
    overflowX: "hidden",
    minHeight: "85%",
    maxHeight: "85%",
    flex: 1,
  },
  sendMsg: {
    margin: "1%",
    marginBottom: 0,
  },
  inform: {
    maxHeight: "10%",
    up: "10%",
    display: "flex",
    alignSelf: "flex-end",
    alignSelf: "center",
  },
}));

function Chatbox(props) {
  const classes = useStyles();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);

  //Renders all messages ordered by the time they were sent
  useEffect(() => {
    firestore
      .collection(`${props.roomID}`)
      .orderBy("createdAt")
      .limit(50)
      .onSnapshot((snapShot) => {
        setMessages(snapShot.docs.map((doc) => doc.data()));
      });
  }, []);

  //Adds new message typed to the database
  async function sendMessage(e) {
    setEmojiPickerOpen(false);
    e.preventDefault();
    if (newMessage.length < 1) {
      return;
    }
    const name = auth.currentUser.displayName;
    await firestore.collection(`${props.roomID}`).add({
      text: newMessage,
      sender: name ? name : "User",
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    });
    setNewMessage("");
  }

  //Toggles emoji picker
  const handleEmojiButton = () => {
    setEmojiPickerOpen(!emojiPickerOpen);
  };

  //Adds emoji to the new message
  const addEmoji = (e) => {
    let emoji = e.native;
    setNewMessage(newMessage + emoji);
  };

  //Renders all components
  return (
    <div className={classes.chatbox}>
      <div className={classes.msgCollection}>
        {messages.map((message) => {
          return (
            <div key={message.id}>
              {
                <Message
                  text={message.text}
                  time={message.createdAt}
                  sender={message.sender}
                />
              }
            </div>
          );
        })}
        {emojiPickerOpen && <Picker onSelect={addEmoji} />}
      </div>
      <form
        className={classes.form}
        noValidate
        autoComplete="off"
        onSubmit={sendMessage}
      >
        <div className={classes.inform}>
          <Button onClick={handleEmojiButton}>
            <EmojiEmotionsIcon />
          </Button>
          <TextField
            className={classes.sendMsg}
            id="outlined-basic"
            label="Message"
            variant="outlined"
            value={newMessage}
            onChange={(e) => {
              setNewMessage(e.target.value);
            }}
          />
          <Button className={classes.btn} type="submit">
            <SendIcon className={classes.sendBtn}></SendIcon>
          </Button>
        </div>
      </form>
    </div>
  );
}

export default withTheme(Chatbox);
