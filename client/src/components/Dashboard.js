//It renders the first introductory page before authentication before

import React from "react";
import { makeStyles } from "@material-ui/core";
import FrontImage from "./Images/FrontVideoCall.jpg";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { useHistory } from "react-router";

//Adding styles
const useStyles = makeStyles((theme) => ({
  root: {
    height: "99vh",
    background: "#c46c00",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  child: {
    height: "85%",
    width: "85%",
    background: "#fff2e0",
    borderRadius: "50px",
    boxShadow: "10px 10px 10px 5px #3e2723",
    display: "flex",
    alignItems: "center",
  },
  imgbox: {
    height: "55%",
    width: "38%",
    margin: "5%",
    alignSelf: "flex start",
  },
  images: {
    height: "100%",
    width: "100%",
  },
  textbox: {
    height: "70%",
    width: "40%",
    margin: "5%",
  },
  text: {
    color: "#894b00",
  },
  button: {
    marginTop: "5%",
    backgroundColor: "#894b00",
  },
  txtinbtn: {
    color: "white",
    fontWeight: "bold",
    paddingTop: "1%",
  },
}));

function Dashboard() {
  const classes = useStyles();
  const history = useHistory();

  //Redirects to sign up page
  const handleClick = () => {
    history.push("/signup");
  };

  //Renders all component
  return (
    <div className={classes.root}>
      <div className={classes.child}>
        <div className={classes.imgbox}>
          <img className={classes.images} src={FrontImage}></img>
        </div>
        <div className={classes.textbox}>
          <Typography
            className={classes.text}
            variant="h4"
            component="h2"
            gutterBottom
          >
            Microsoft Teams
          </Typography>
          <Typography
            className={classes.text}
            variant="h2"
            component="h2"
            gutterBottom
          >
            <strong>Archer Clone</strong>
          </Typography>
          <Typography variant="body1" gutterBottom>
            Now all your calls and meetings are just a click away. Our handy
            video and audio calling app helps you connect with your folks in the
            most engaging and easiest possible way. Join our bandwagon now to
            explore the more!
          </Typography>
          <br />
          <Typography variant="body1" gutterBottom>
            <strong>
              Kyuki Nazdeekiyo mei to apnapan sab dhund lete hai,
              <br />
              Aao hum dooriyo mei bhi dhund lein :)
            </strong>
          </Typography>
          <Button
            variant="contained"
            className={classes.button}
            onClick={handleClick}
          >
            <Typography
              className={classes.txtinbtn}
              variant="body1"
              component="body1"
              gutterBottom
            >
              CREATE AN ACCOUNT RIGHT AWAY!
            </Typography>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
