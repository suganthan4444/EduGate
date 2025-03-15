import React, { useState, useEffect } from 'react';
import api from './api';

function AdminLearners() {
    const [learnerCourses, setLearnerCourses] = useState([]);
    const [csrfToken, setCsrfToken] = useState('');

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
        fetchLearnerCourses();
    }, []);

    const fetchLearnerCourses = async () => {
      try {
          const response = await api.get('/api/get-learner-courses/');
          const data = response.data;
          if (!data.success) {
              throw new Error('Failed to fetch learner courses');
          }
          setLearnerCourses(data.data.filter(course => !course.course_purchase_status));
      } catch (error) {
          console.error('Error fetching learner courses:', error.message);
      }
  };
  
  const grantCourse = async (learnerId, courseId) => {
      try {
          const response = await api.patch(`/api/grant-course/${learnerId}/${courseId}/`, {
              method: 'PATCH',
              headers: {
                  'Content-Type': 'application/json',
                  'X-CSRFToken': csrfToken // Fetch CSRF token from cookies
              }
          });
          if (!response.ok) {
              throw new Error('Failed to grant course');
          }
          alert('Course granted successfully');
          await fetchLearnerCourses(); // Refresh learner courses after granting
      } catch (error) {
          console.error('Error granting course:', error.message);
          alert('Failed to grant course');
      }
  };

    return (
        <div>
            <h1>Learners Course Requests</h1>
            <table>
                <thead>
                    <tr>
                        <th>Learner Name</th>
                        <th>Learner ID</th>
                        <th>Course ID</th>
                        <th>Course Name</th>
                        <th>Educator ID</th>
                        <th>Educator Name</th>
                        <th>Price</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {learnerCourses.map(course => (
                        <tr key={course.course_id}>
                            <td>{course.learner_name}</td>
                            <td>{course.learner_id}</td>
                            <td>{course.course_id}</td>
                            <td>{course.course_name}</td>
                            <td>{course.educator_id}</td>
                            <td>{course.educator_name}</td>
                            <td>{course.course_price}</td>
                            <td>
                                <button onClick={() => grantCourse(course.learner_id, course.course_id)}>
                                    Grant Course
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default AdminLearners;
