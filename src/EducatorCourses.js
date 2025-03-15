import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from './api';
import './EducatorCourses.css';

function EducatorCourses({ educatorId }) {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    

    useEffect(() => {
        async function fetchCourses() {
            try {
                const educatorId = sessionStorage.getItem('educatorId');
                const response = await api.get(`/educator-courses/?educatorId=${educatorId}`);
                setCourses(response.data);
            } catch (error) {
                console.error('Error fetching courses:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchCourses();
    }, [educatorId]);

    const handleAddCourse = () => {
        navigate('/add-course');
    };

    const linkStyle = {
        textDecoration: 'none',
        color: 'inherit',
    };
    
    const confirmLogout = () => {
        const userConfirmed = window.confirm('Are you sure you want to log out?');
        if (userConfirmed) {
            sessionStorage.clear();
            navigate('/home');
        }
    };

    return (
        
        <div className="educator-courses">
            <div className="educator-space">
            <nav className="sidebar">
                <ul>
                    <li>
                        <Link to={`/educator-profile/${educatorId}`} style={linkStyle}>Your Profile</Link>
                    </li>
                    <li>
                        <Link to={`/educator-courses/${educatorId}`} style={linkStyle}>Your Courses</Link>
                    </li>
                </ul>
                <button onClick={confirmLogout}>Logout</button>
            </nav>
            </div>
          {loading && <div>Loading...</div>}
          {!loading && courses.length === 0 && <div>No Courses Released</div>}
          {!loading && (
            <>
              {courses.map(course => {
                console.log("Image URL:", course.course_thumbnail);
                let status = '';
                        if (!course.course_release_status && !course.course_reject_status) {
                            status = 'Requested';
                        } else if (course.course_release_status) {
                            status = 'Released';
                        } else if (course.course_reject_status) {
                            status = 'Rejected';
                        }
                return (
                  <Link to={`/course-inlook/${course.course_id}`} key={course.course_id}>
                    <div className="course-card">
                      <img src={course.course_thumbnail} alt={course.course_name} />
                      <div className="course-info">
                        <h3>{course.course_name}</h3>
                        <p className="price">Price: {course.course_price}</p>
                        <p className="status">Status: {status}</p>
                      </div>
                    </div>
                  </Link>
                );
              })}
             <button className="add-course-button" onClick={handleAddCourse}>+    Add Course</button>
            </>
          )}
        </div>
      );
      
}

export default EducatorCourses;
