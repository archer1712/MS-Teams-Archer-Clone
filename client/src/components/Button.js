//Renders the button with content being the name sent as props

import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import { withTheme } from "./Theme";

//Adding styles
const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
    },
  },
}));

//Rendering button
function ContainedButtons(props) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Button onClick={props.todo} variant="contained" color="secondary">
        {props.name}
      </Button>
    </div>
  );
}

export default withTheme(ContainedButtons);
