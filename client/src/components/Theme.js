import React from 'react';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import brown from '@material-ui/core/colors/brown';
import green from '@material-ui/core/colors/green';


const theme = createMuiTheme({
    palette: {
        primary: brown,
        secondary: green
    }
});

const Theme = (props) => {
    const {children} = props;
    return <ThemeProvider theme={theme}>{children}</ThemeProvider>
}

export const withTheme = (Component) =>{
    return (props) => {
        return (
            <Theme>
                <Component {...props}/>
            </Theme>
        );
    };
};