import {React} from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, Navigate} from 'react-router-dom';
import './App.css';
import logo from './Color.png';
import { Helmet } from 'react-helmet';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faEnvelope, faChalkboardUser, faBookOpenReader, faLightbulb } from '@fortawesome/free-solid-svg-icons';

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
import EnrollCourse from './EnrollCourse';
import EducatorSpace from './EducatorSpace';
import EducatorProfile from './EducatorProfile';
import EducatorCourses from './EducatorCourses';
import AddCourse from './AddCourse';
import AdminHome from './AdminHome';
import AdminLogin from './AdminLogin';
import AdminCourses from './AdminCourses';
import AdminLearners from './AdminLearners';
import CourseInLook from './CourseInLook';
import CoursePreview from './CoursePreview';
import EducatorPreview from './EducatorPreview';
import LearnerCoursePreview from './LearnerCoursePreview';


function App() {

  return (
    <Router >
      <Helmet>
        <title>EduGate</title>
        <meta name="description" content="This is my React app" />
        <link rel="icon" href="/Color.png" type="image/x-icon" className="edugate-logo"/>
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
        <Route path="/courses" element={<Courses/>} />
        <Route path="/enroll-course/:course_id" element={<EnrollCourse />} />
        <Route path="/educator-space/*" element={<EducatorSpace />} />
        <Route path="/educator-profile/*" element={<EducatorProfile />} />
        <Route path="/educator-courses/*" element={<EducatorCourses />} />
        <Route path="/add-course" element={<AddCourse />} />
        <Route path="/admin-courses" element={<AdminCourses />} />
        <Route path="/admin-home" element={<AdminHome />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin-learners" element={<AdminLearners />} />
        <Route path="/course-inlook/:courseId" element={<CourseInLook />} />
        <Route path="/course-preview/:course_id" element={<CoursePreview/>} />
        <Route path="/educator-preview/:educator_id" element={<EducatorPreview/>} />
        <Route path="/learner-course-preview/:course_id" element={<LearnerCoursePreview/>} />
      </Routes>
    </Router>
  );
}


export default App;
