import React, { useRef, useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { Alert, AlertTitle } from '@material-ui/lab';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { withTheme } from './Theme';
import { useAuth } from '../contexts/AuthProvider';
import { auth } from '../Firebase';
import { useHistory } from 'react-router-dom';
import Header from './Header';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="/dashboard">
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
    backgroundColor: theme.palette.primary.main,
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

function LogIn() {
  const classes = useStyles();
  const nameRef = useRef();
  const emailRef = useRef()
  const passwordRef = useRef()
  const { login,updateName, currentUser } = useAuth()
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const history = useHistory()

  async function handleSubmit(e) {
    e.preventDefault()
    setError("")
    setLoading(true)
    
    try{
    const res=await login(emailRef.current.value,passwordRef.current.value,nameRef.current.value);
    history.push("/");
     }catch(err){
       console.log(err)
       setError("Can't Log In")
     }
     setLoading(false);
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
          Log In to Your Account
        </Typography>
        {error && 
        <div className={classes.root, classes.alertBox}>
        <Alert className={classes.alert} severity="error">
          <AlertTitle><strong>ERROR</strong></AlertTitle>
          {error}
        </Alert>
      </div>}
        <form className={classes.form} noValidate onSubmit={handleSubmit}>
        <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="name"
            label="First Name"
            name="name"
            autoComplete="name"
            inputRef={nameRef}
            autoFocus
          />
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
            className={classes.text}
            autoFocus
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            inputRef={passwordRef}
            className={classes.text}
            autoComplete="current-password"
          />
          <Button
            type="submit"
            disabled={loading}
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Log In
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href="/forgot-password" variant="body2" color="primary" className={classes.links}>
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link href="/signup" variant="body2" color="primary" className={classes.links}>
                Need an Account? 
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

export default withTheme(LogIn);