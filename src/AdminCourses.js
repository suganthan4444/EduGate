import React, { useState, useEffect } from 'react';
import api from './api';
import './AdminCourses.css';
import { useNavigate } from 'react-router-dom';

function AdminCourses() {
    const [requestedCourses, setRequestedCourses] = useState([]);
    const [releasedCourses, setReleasedCourses] = useState([]);
    const [csrfToken, setCsrfToken] = useState('');
    const navigate= useNavigate();

    useEffect(() => {
        async function fetchCsrfToken() {
            try {
                const response = await api.get('/get-learner-csrf-token/');
                setCsrfToken(response.data.csrfToken);
            } catch (error) {
                console.error('Error fetching CSRF token:', error);
            }
        }

        fetchCsrfToken();
    }, []);

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            const response = await api.get('/admin-courses');
            const courses = response.data;
            const requested = courses.filter(course => !course.course_release_status && !course.course_reject_status);
            const released = courses.filter(course => course.course_release_status);
            setRequestedCourses(requested);
            setReleasedCourses(released);
        } catch (error) {
            console.error('Error fetching courses:', error);
        }
    };

    const handleRelease = async (courseId) => {
        try {
            const response = await api.post(`/release-course/${courseId}/`, {headers: {
                'X-CSRFToken': csrfToken
            }});
            fetchCourses(); 
            alert(response.data.message);
        } catch (error) {
            console.error('Error releasing course:', error);
            alert('Error releasing course: ' + error.message);
        }
    };
    

    const handleReject = async (courseId) => {
        try {
            await api.post(`/reject-course/${courseId}`, {headers: {
                'X-CSRFToken': csrfToken
            }});
            fetchCourses();
        } catch (error) {
            console.error('Error rejecting course:', error);
        }
    };

    return (
        <div className="admin-courses-container">
            <h2>Release Requested Courses</h2><br></br>
            <table>
                <thead>
                    <tr>
                        <th>Course ID</th>
                        <th>Course Name</th>
                        <th>Educator ID</th>
                        <th>Educator Name</th>
                        <th>Price</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {requestedCourses.map(course => (
                        <tr key={course.course_id}>
                            <td >{course.course_id}</td>
                            <td onClick={() => navigate(`/course-inlook/${course.course_id}`)} className='navi'>{course.course_name}</td>
                            <td>{course.educator_id}</td>
                            <td>{course.educator_name}</td>
                            <td>{course.course_price}</td>
                            <td className="buttons">
                                <button className="release" onClick={() => handleRelease(course.course_id)}>Release</button>
                                <button className="reject" onClick={() => handleReject(course.course_id)}>Reject</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table><br></br>

            <h2>Released Courses</h2><br></br>
            <table>
                <thead>
                    <tr>
                        <th>Course ID</th>
                        <th>Course Name</th>
                        <th>Educator ID</th>
                        <th>Educator Name</th>
                        <th>Price</th>
                    </tr>
                </thead>
                <tbody>
                    {releasedCourses.map(course => (
                        <tr key={course.course_id}>
                            <td>{course.course_id}</td>
                            <td onClick={() => navigate(`/course-inlook/${course.course_id}`)} className='navi'>{course.course_name}</td>
                            <td>{course.educator_id}</td>
                            <td>{course.educator_name}</td>
                            <td>{course.course_price}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default AdminCourses;
