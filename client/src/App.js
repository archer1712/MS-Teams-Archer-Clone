import React from 'react';
import { BrowserRouter, Route, Switch } from "react-router-dom";
import CreateRoom from "./routes/CreateRoom";
import Room from "./routes/Room";
import Header from './components/Header';
import SignUp from './components/SignUp';
import AuthProvider from './contexts/AuthProvider'
import LogIn from './components/LogIn';
import PrivateRoute from './components/PrivateRoute';
import ForgotPassword from './components/ForgotPassword';
import Dashboard from './components/Dashboard';
import Chatroom from './components/Chatroom';
import ChatView from './components/ChatView';

function App() {
  return (
    <AuthProvider>
    <div >
      <BrowserRouter>
      {/* <Header /> */}
        <Switch>
          <Route path="/forgot-password" component={ForgotPassword} />
          <Route path="/signup" component={SignUp} />
          <Route path="/login" component={LogIn} />
          <PrivateRoute path="/" exact component={CreateRoom} />
          <Route path="/room/:roomID" component={Room} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/chat/:roomID" component={Chatroom} />
          <Route path="/chatview/:roomID" component={ChatView} />
        </Switch>
      </BrowserRouter>
    </div>
    </AuthProvider>
  );
}

export default App;
