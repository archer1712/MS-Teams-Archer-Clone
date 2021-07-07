import React, { useState, useRef } from 'react';
import { send } from 'emailjs-com';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { useAuth } from '../contexts/AuthProvider';

const useStyles = makeStyles((theme) => ({
    paper: {
      marginTop: theme.spacing(8),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    avatar: {
      margin: theme.spacing(1),
      backgroundColor: theme.palette.secondary.main,
    },
    form: {
      width: '100%', // Fix IE 11 issue.
      marginTop: theme.spacing(1),
    },
    submit: {
      margin: theme.spacing(3, 0, 2),
    },
    body: {
        margin: theme.spacing(1),
        textAlign: 'center'
    }
  }));

function Invite(props) {
    const classes = useStyles();
    const link = `/room/${props.roomID}`;
    const fullLink = `http://localhost:3000${link}`;
    const { currentUser } = useAuth();
    const userName = currentUser? currentUser.displayName : '';
    const friendsMail = useRef();
    const [toSend, SetToSend] = useState({
        from_name: userName,
        link: props.roomID,
        to_email: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(toSend.to_email)
        send('service_ni5sust', 'template_i4sjnji', toSend, 'user_JlLhx7BgxzPcaUc4Z9YCo')
        .then((response) => console.log(response))
        .catch((err) => console.log(err));
        console.log("submitted")
    }

    const handleChange = (e) => {
        const email = e.target.value;
        SetToSend({
            from_name: userName,
            link: fullLink,
            to_email: friendsMail.current.value
        })
    }

    return (
        <div>
           <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
                <Typography component="h1" variant="h5">
                    Invite Friends!
                </Typography>
                <Typography className={classes.body} component="body1" variant="body1">
                    Fill in your friend's mail ID and press the button below to invite them over.
                </Typography>
                <form className={classes.form} noValidate onSubmit={handleSubmit}>
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Friends' mail ID"
                    name={toSend.to_email}
                    onChange={handleChange}
                    inputRef={friendsMail}
                    autoComplete="email"
                    autoFocus
                />
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    className={classes.submit}
                >
                    Send Invite
                </Button>
                </form>
            </div>
            </Container> 
        </div>
    )
}

export default Invite;
