import React, { useEffect } from 'react';
// import { useDispatch } from 'react-redux';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Landing from "./containers/Landing";
import Login from "./containers/Login";
import Journey from "./containers/Journey";
import Profile from "./containers/Profile";
import Wanderbud from "./media/wanderbud-logo.png"


import { selectFirstname } from './reducers/userSlice';

// import ErrorPage from './containers/ErrorPage';


const App = () => {
  const firstName = useSelector(selectFirstname);

  return (
    <Router>
        <nav className="navbar">
            <img className="navbar-logo" src={Wanderbud} alt="Wanderbud" />
            <h1>wanderBud</h1>
            <div className="navbar-links">
              { !firstName && <Link className="navbar-link" to="/"> Home </Link>}
              { !firstName && <Link className="navbar-link" to="/login">Login </Link>}
              { firstName && <Link className="navbar-link" to="/journey"> Journeys </Link>}
              { firstName && <Link className="navbar-link" to="/profile"> Profile </Link>}
            </div>
        </nav>
        <Routes>
            <Route path="/login" element={ <Login /> }/> 
            <Route path="/journey" element={ <Journey /> }/> 
            <Route path="/profile" element={ <Profile /> }/>
            <Route path="/*" element={<Landing />}/> 
            {/* error page */}
            {/* <Route path="*" element={<ErrorPage />}/>  */}
        </Routes>
    </Router>

    // <div>
    //   <PostDisplay />
    // </div>
  );
}

export default App;
