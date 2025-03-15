// LearnerProfile.js

import React, { useState, useEffect } from 'react';
import api from './api';
import { useNavigate, Link } from 'react-router-dom'; 
import './LearnerCourses.css';

function LearnerCourses() {
    const learnerId  = sessionStorage.getItem('learnerId');
    const [learnerCourses, setLearnerCourses] = useState([]);
    console.log({learnerId})
    const navigate = useNavigate();

    const confirmLogout = () => {
        const userConfirmed = window.confirm('Are you sure you want to log out?');
        if (userConfirmed) {
            sessionStorage.clear();
            navigate('/home');
        }
    };

    const linkStyle = {
        textDecoration: 'none',
        color: 'inherit',
    };

    useEffect(() => {
        fetchLearnerCourses();
    });

    const fetchLearnerCourses = async () => {
      try {
          const response = await api.get(`/api/learner-courses/${learnerId}`);
          const data = response.data;
          if (!data.success) {
              throw new Error('Failed to fetch learner courses');
          }
          
          console.log({data})
          setLearnerCourses(data.data.filter(course => course.course_purchase_status));
      } catch (error) {
          console.error('Error fetching learner courses:', error.message);
      }
  };

    return (
        <div>
            <div className='learner-navbar'>
            <nav className="learner-sidebar">
                <ul>
                    <li>
                        <Link to={`/learner-profile/${learnerId}`} style={linkStyle}>Your Profile</Link>
                    </li>
                    <li>
                        <Link to={`/learner-courses/${learnerId}`} style={linkStyle}>Your Courses</Link>
                    </li>
                </ul>
                <button onClick={confirmLogout}>Logout</button>
            </nav>
            </div>
            <h1>Learner Profile</h1>
            <div className="learner-cards">
                {learnerCourses.map(course => (
                    <div key={course.course_id} className="learner-card">
                      <img src={course.course_thumbnail} alt={course.course_name} className='thumb' onClick={() => navigate(`/course-inlook/${course.course_id}`)}></img>
                        <h3 className='course-name' onClick={() => navigate(`/course-inlook/${course.course_id}`)}>{course.course_name}</h3>
                        <p onClick={() => navigate(`/educator-preview/${course.educator_id}`)} className='ed-name'>by {course.educator_name}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default LearnerCourses;
