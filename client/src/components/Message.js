import React from "react";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  root: {
    border: 'solid 2px',
    borderColor: '#3e2723',
    borderRadius: '10px',
    minHeight: '20px',
    padding: '2%',
    margin: '3%'
  },
  text: {
    maxWidth: '20px'
  }
});

export default function SimpleCard(props) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div><strong>{props.sender}</strong></div>
      <div>
        <p className={classes.text}>{props.text}</p>
      </div>
    </div>
  );
}
