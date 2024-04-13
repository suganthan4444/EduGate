//App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import './App.css';
import logo from './Color.png';
import { Helmet } from 'react-helmet';

import AboutUs from './AboutUs';
import LearnerSignIn from './LearnerSignIn';
import EducatorSignIn from './EducatorSignIn';
import ContactUs from './ContactUs';
import Home from './Home';
import EducatorSignUp from './EducatorSignUp';

function App() {
  return (
    <Router>
      <Helmet>
        <title>EduGate</title>
        <meta name="description" content="This is my React app" />
        <link rel="icon" href="/Color.png" type="image/x-icon" />
      </Helmet>
      
      <nav className="navbar">
        <div className="left">
          <NavLink to="/home">
            <img src={logo} width="200px" alt="logo" />
          </NavLink>
        </div>
        <div className="right">
          <ul className="list">
            <li>
              <NavLink to="/home" activeClassName="active">
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/about-us" activeClassName="active">
                About Us
              </NavLink>
            </li>
            <li>
              <NavLink to="/learner-signin" activeClassName="active">
                Learner Login
              </NavLink>
            </li>
            <li>
              <NavLink to="/educator-signin" activeClassName="active">
                Educator Login
              </NavLink>
            </li>
            <li>
              <NavLink to="/contact-us" activeClassName="active">
                Contact Us
              </NavLink>
            </li>
          </ul>
        </div>
      </nav>
      
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<Home />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/learner-signin" element={<LearnerSignIn />} />
        <Route path="/educator-signin" element={<EducatorSignIn />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/educator-signup" element={<EducatorSignUp />} /> 
      </Routes>
    </Router>
  );

}

export default App;
