import React, { useEffect } from 'react';
import { connectionWithWebSocket } from './utils/wssConnection';
import {
  Route,
  BrowserRouter as Router,
  Routes
} from "react-router-dom";
import LoginPage from './LoginPage/LoginPage';
import MeetingPage from './MeetingPage/MeetingPage';

function App() {
  useEffect(() => {
    connectionWithWebSocket();
  }, [])

  return (
    <Router>
      <Routes>
        <Route path = '/' element = {<LoginPage />} />
        <Route path = '/meeting' element = {<MeetingPage />}/>
      </Routes>
    </Router>
  );
}

export default App;
