import React, { useState } from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Link from '@material-ui/core/Link';
import { withTheme } from './Theme';
import Divider from '@material-ui/core/Divider';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import Button from "@material-ui/core/Button";
import Tooltip from '@material-ui/core/Tooltip';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

const useStyles = makeStyles((theme) => ({
    root: {
        padding: '3%'
    },
    buttonGroup: {
        height: '8vh',
        background: '#795548',
        // border: 'solid 2px black',
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        "& > *": {
          margin: theme.spacing(1)
        }
    },
      mediaButton: {
        height: theme.spacing(6),
        width: theme.spacing(6),
        padding: theme.spacing(3),
        margin: theme.spacing(1)
    },
      mediaIcon: {
        height: theme.spacing(5),
        width:  theme.spacing(5),
        color: '#3e2723'
    },
}));



function Info(props) {
    const classes = useStyles();
    const link = `/room/${props.roomID}`
    const [openBar, setOpenBar] = React.useState(false);

    const handleCopyLink = () => {
        const fullLink = `https://arcane-escarpment-21812.herokuapp.com${link}`;
        navigator.clipboard.writeText(fullLink);
        setOpenBar(true);
    }

    const handleClose = () => {
        setOpenBar(false);
    }

    return (
        <div className={classes.root}>
            <Typography variant="h5" gutterBottom>
                <strong>Call Details</strong>
            </Typography>
            <Typography variant="h6" gutterBottom>
                Call Link
            </Typography>
            <Typography variant="body1" gutterBottom>
                Send the following link to your friends to invite them to this call!
            </Typography>
            <Typography variant="body1" gutterBottom>
                <Link href={link}>Call Link</Link>
            </Typography>
            <Divider />
            <Tooltip title="Copy Meet Link">
            <Button className={classes.mediaButton} onClick={()=> {handleCopyLink()}}><FileCopyIcon className={classes.mediaIcon} /></Button>
            </Tooltip>
            <Typography variant="body1" gutterBottom>
                Copy the meet Link from here!
            </Typography>
            <Snackbar
                anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
                }}
                open={openBar}
                autoHideDuration={6000}
                onClose={handleClose}
                message="Link copied to clipboard"
                action={
                <React.Fragment>
                    <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
                    <CloseIcon fontSize="small" />
                    </IconButton>
                </React.Fragment>
                }
            />
        </div>
    )
}

export default withTheme(Info);
