import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import './App.css';
import logo from './Color.png';
import { Helmet } from 'react-helmet';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faEnvelope, faChalkboardUser, faBookOpenReader, faLightbulb, faBars } from '@fortawesome/free-solid-svg-icons';

import AboutUs from './AboutUs';
import LearnerSignIn from './LearnerSignIn';
import EducatorSignIn from './EducatorSignIn';
import ContactUs from './ContactUs';
import Home from './Home';
import EducatorSignUp from './EducatorSignUp';
import LearnerSignUp from './LearnerSignUp';
import LearnerSpace from './LearnerSpace';
import LearnerProfile from './LearnerProfile';
import LearnerCourses from './LearnerCourses';
import Courses from './Courses';
import Learners from './Learners';
import Educators from './Educators';
import EducatorSpace from './EducatorSpace';
import EducatorProfile from './EducatorProfile';
import EducatorCourses from './EducatorCourses';
import AddCourse from './AddCourse';

// Importing MyComponen


function App() {

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  return (
    <Router>
      <Helmet>
        <title>EduGate</title>
        <meta name="description" content="This is my React app" />
        <link rel="icon" href="/Color.png" type="image/x-icon" />
      </Helmet>
      
      <nav className="navbar">
      <div className="menu-icon" onClick={toggleMenu}>
        <FontAwesomeIcon icon={faBars} style={{ color: "#ffffff" }} />
      </div>

      {/* Menu Items */}
      {isMenuOpen && (
        <div className="menu-items">
          <ul>
            <li>
              <NavLink to="/courses">Courses</NavLink>
            </li>
            <li>
              <NavLink to="/educators">Educators</NavLink>
            </li>
            <li>
              <NavLink to="/learners">Learners</NavLink>
            </li>
            {/* Add more menu items as needed */}
          </ul>
        </div>
      )}

        <div className="left">
          <NavLink to="/home">
            <img src={logo} width="200px" alt="logo" />
          </NavLink>
        </div>

        <div className="right">
          <ul className="list">
            <li>
              <NavLink to="/home" className={({ isActive }) => (isActive ? "active" : "")}>
              <FontAwesomeIcon icon={faHouse} style={{ color: "#ffffff" ,}} /> Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/about-us" className={({ isActive }) => (isActive ? "active" : "")}>
              <FontAwesomeIcon icon={faLightbulb} style={{color: "#ffffff",}} /> About Us
              </NavLink>
            </li>
            <li>
              <NavLink to="/learner-signin" className={({ isActive }) => (isActive ? "active" : "")}>
              <FontAwesomeIcon icon={faBookOpenReader} style={{color: "#ffffff",}} /> Learner Login
              </NavLink>
            </li>
            <li>
              <NavLink to="/educator-signin" className={({ isActive }) => (isActive ? "active" : "")}>
              <FontAwesomeIcon icon={faChalkboardUser} style={{color: "#ffffff",}} /> Educator Login
              </NavLink>
            </li>
            <li>
              <NavLink to="/contact-us" className={({ isActive }) => (isActive ? "active" : "")}>
              <FontAwesomeIcon icon={faEnvelope} style={{color: "#ffffff",}} /> Contact Us
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
        <Route path="/learner-signup" element={<LearnerSignUp />} />
        <Route path="/learner-space/*" element={<LearnerSpace />} />
        <Route path="/learner-profile/*" element={<LearnerProfile />} />
        <Route path="/learner-courses/*" element={<LearnerCourses />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/learners" element={<Learners />} />
        <Route path="/educators" element={<Educators />} />
        <Route path="/educator-space/*" element={<EducatorSpace />} />
        <Route path="/educator-profile/*" element={<EducatorProfile />} />
        <Route path="/educator-courses/*" element={<EducatorCourses />} />
        <Route path="/add-course" element={<AddCourse />} />
      </Routes>

    </Router>
  );
}


export default App;
