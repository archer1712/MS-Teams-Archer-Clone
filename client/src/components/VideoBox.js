import React, { useRef, useEffect } from 'react';
import styled from "styled-components";
import { makeStyles } from "@material-ui/core";
import IconButton from '@material-ui/core/IconButton';
import FullscreenIcon from '@material-ui/icons/Fullscreen';
import Tooltip from '@material-ui/core/Tooltip';

const useStyles = makeStyles((theme) => ({
    bottomBar: {
        ...theme.typography.button,
        backgroundColor: theme.palette.background.paper,
        // padding: theme.spacing(1),
        color: '#3e2723',
        display: 'flex',
        alignItems: 'center',
    },
    videoContainer: {
        height: '50%',
        width: '65%',
        borderRadius: '10px',
        border: '5px solid #ffffff',
        margin: '10px',
        paddingBottom: '10%',
        display: 'flex',
        flexDirection: 'column',
    },
    video: {
        height: '118%',
        width: '100%',
    },
    fullScreenBtn: {
        size: '1%',
        alignSelf: 'flex-end'
    },
    username: {
        border: '10px solid'
    }
}));

const handleFullscreen = (key) => {
    const el = document.getElementById(key);
    if (el.requestFullscreen) {
        el.requestFullscreen();
      } else if (el.msRequestFullscreen) {
        el.msRequestFullscreen();
      } else if (el.mozRequestFullScreen) {
        el.mozRequestFullScreen();
      } else if (el.webkitRequestFullscreen) {
        el.webkitRequestFullscreen();
      }
}

const VideoBox = React.forwardRef((props, ref) =>{
    const classes = useStyles();
    return (
        <div>
            <div className={classes.videoContainer}>
            {props.mute==="true"? 
            <video muted className={classes.video} id={props.idtohold}  playsInline autoPlay ref={ref}/> :
            <video  className={classes.video} id={props.idtohold}  playsInline autoPlay ref={ref}/> }
            <div className={classes.bottomBar}>
                <div className={classes.usnername}>{props.userName}</div>
                <Tooltip title="Full Screen"><span>
                <IconButton className={classes.fullScreenBtn}><FullscreenIcon onClick={()=> handleFullscreen(props.idtohold)}/></IconButton>
                </span></Tooltip>
            </div>
            </div>
        </div>
    )
});

export default VideoBox
