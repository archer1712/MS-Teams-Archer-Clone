import React, { useState, useEffect, useRef} from 'react';
import Header from './Header';
import styled from "styled-components";
import { makeStyles } from "@material-ui/core";
import { Input, TextField } from '@material-ui/core';
import  Button from '@material-ui/core/Button';
import SendIcon from '@material-ui/icons/Send';
import { firestore, auth } from '../Firebase';
import firebase from 'firebase';
import 'emoji-mart/css/emoji-mart.css';
import { Picker } from 'emoji-mart';
import EmojiEmotionsIcon from '@material-ui/icons/EmojiEmotions';
import RoomMessage from './RoomMessage';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { useHistory } from "react-router";

const drawerWidth = 400;

const useStyles = makeStyles((theme) => ({
    root: {
        height: '89%',
        width: '99%',
        display: 'flex',
        flexDirection: 'row',
        overflow: 'scroll',
    },
    chatroom: {
        height: '90%',
        width: '60vw',
        background: '#ffcc80',
        display: 'flex',
        flexDirection: 'row',
        padding: '5% 1%',
        overflow: 'auto',
        overflowX: 'hidden',
        position: 'absolute',
        top: '0px',
        wordWrap: 'break-word'
    },
    sendMsg: {
        margin: '1%',
        width: '75%',
        "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
            borderColor: "white"
        },
        "&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
            borderColor: "white"
        },
        "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "white"
        },
        "& .MuiOutlinedInput-input": {
            color: "white"
        },
        "&:hover .MuiOutlinedInput-input": {
            color: "white"
        },
        "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-input": {
            color: "white"
        },
        "& .MuiInputLabel-outlined": {
            color: "white"
        },
        "&:hover .MuiInputLabel-outlined": {
            color: "white"
        },
        "& .MuiInputLabel-outlined.Mui-focused": {
            color: "white"
        }
    },
    appBar: {
        top: 'auto',
        bottom: 0,
        background: '#3e2723',
        position: 'fixed',
        width: '60.5vw'
    },
    iconBtn: {
        color: 'white',
    },
    msgList: {
        display: 'flex',
        flexDirection: 'column',
    },
    joinCall: {
        color: '#3e2723',
        background: '#ffcc80',
        border: 'solid 2px white',
        borderRadius: '10px',
        '&:hover':{
            color: 'white',
            background: '#3e2723'
        }
    },
    header: {
        zIndex: theme.zIndex.drawer + 1,
        position: 'fixed'
    },
    emojiPicker: {
        
    }
}));

const Chatroom = (props) => {
    const classes = useStyles();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);
    const roomID = props.roomID;
    const history = useHistory();

    useEffect(()=> {
        firestore.collection(`${roomID}`).orderBy('createdAt').limit(50).onSnapshot((snapShot)=>{
            setMessages(snapShot.docs.map(doc=> doc.data()));
        })
    }, [])

    async function sendMessage(e){
        setEmojiPickerOpen(false);
        e.preventDefault();
        if(newMessage.length<1){return;}
        const name = auth.currentUser.displayName;
        await firestore.collection(`${roomID}`).add({
            text: newMessage,
            sender: name? name: "User",
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        })
        setNewMessage('')
    }

    const handleEmojiButton = () => {
        setEmojiPickerOpen(!emojiPickerOpen);
    }

    const addEmoji = (e) => {
        let emoji = e.native;
        setNewMessage(newMessage + emoji);
    }

    const handleVideoCall = () => {
        history.push(`/room/${roomID}`);
    }

    return (
        <div className={classes.root}>
            {/* <Header className={classes.header} position="fixed"/> */}
            <div className={classes.chatroom}>
                <div className={classes.msgList}>
                    {messages.map(message=> {
                        return(
                            <div key={message.id} className={classes.message}>{
                                <RoomMessage text={message.text} time={message.createdAt} sender={message.sender}/>
                            }</div>
                        )
                    })}
                    {emojiPickerOpen && <Picker className={classes.emojiPicker} onSelect={addEmoji}/>}
                </div>
                <form className={classes.form} noValidate autoComplete="off" onSubmit={sendMessage}>
                    <div className={classes.inform}>
                        <AppBar position="fixed" className={classes.appBar}>
                            <Toolbar>
                                <Button onClick={handleEmojiButton} className={classes.btn}><EmojiEmotionsIcon className={classes.iconBtn}/></Button>
                                <TextField className={classes.sendMsg} id="outlined-basic" label="Message" variant="outlined" value={newMessage} 
                                onChange={(e)=> {setNewMessage(e.target.value);}}/>
                                <Button className={classes.btn} type="submit"><SendIcon className={classes.iconBtn}></SendIcon></Button>
                                <Button variant="contained" className={classes.joinCall} onClick={handleVideoCall}>Join Video Call</Button>
                            </Toolbar>
                        </AppBar>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Chatroom
