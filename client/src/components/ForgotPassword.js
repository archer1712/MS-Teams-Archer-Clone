import React, { useRef, useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import { Alert, AlertTitle } from '@material-ui/lab';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { withTheme } from './Theme';
import { useAuth } from '../contexts/AuthProvider';
import { useHistory } from 'react-router-dom';
import Header from './Header';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://material-ui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: '15vh'
  },
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
    '&:hover': {
      backgroundColor: '#3e2723',
    },
    '&:active': {
      backgroundColor: '#3e2723',
    },
  },
  alertBox: {
    marginTop: theme.spacing(1),
    width: '100%',
  },
  text: {
      "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
        borderColor: '#3e2723'
    },
    "&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
        borderColor: '#3e2723'
    },
    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: '#3e2723'
    },
    "& .MuiOutlinedInput-input": {
        color: '#3e2723'
    },
    "&:hover .MuiOutlinedInput-input": {
        color: '#3e2723'
    },
    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-input": {
        color: '#3e2723'
    },
    "& .MuiInputLabel-outlined": {
        color: '#3e2723'
    },
    "&:hover .MuiInputLabel-outlined": {
        color: '#3e2723'
    },
    "& .MuiInputLabel-outlined.Mui-focused": {
        color: '#3e2723'
    }
  },
  links: {
    color: '#3e2723',
  }
}));

function SignUp() {
  const classes = useStyles();
  const emailRef = useRef()
  const passwordRef = useRef()
  const passwordConfirmRef = useRef()
  const { resetPassword } = useAuth()
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const history = useHistory()

  async function handleSubmit(e) {
    e.preventDefault()

    try {
      setMessage("")
      setError("")
      setLoading(true)
      await resetPassword(emailRef.current.value)
      setMessage("Check your Email for further instructions")
    } catch(err) {
      console.log(err);
      setError("Failed to reset Password")
    }
    setLoading(false)
  }

  return (
    <div className={classes.root}>
    <Header />
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
        </Avatar>
        <Typography component="h1" variant="h5">
          Password Reset
        </Typography>
        {error && 
        <div className={classes.root, classes.alertBox}>
        <Alert className={classes.alert} severity="error">
          <AlertTitle><strong>ERROR</strong></AlertTitle>
          {error}
        </Alert>
      </div>}
      {message && 
      <div className={classes.root, classes.alertBox}>
        <Alert className={classes.alert} severity="success">
          {message}
        </Alert>
      </div>}
        <form className={classes.form} noValidate onSubmit={handleSubmit}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            inputRef={emailRef}
            autoFocus
            className={classes.text}
          />
          <Button
            type="submit"
            disabled={loading}
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Reset Password
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href="/signup" variant="body2" className={classes.links}>
                Need an Account?
              </Link>
            </Grid>
            <Grid item>
              <Link href="/login" variant="body2" className={classes.links}>
                Already have an Account?
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
    </div>
  );
}

export default withTheme(SignUp);