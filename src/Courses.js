import React, { useState, useEffect } from 'react';
import api from './api';
import './Courses.css';

function Courses() {
  const [coursesByDomain, setCoursesByDomain] = useState({});

  useEffect(() => {
    fetchReleasedCourses();
  }, []);

  async function fetchReleasedCourses() {
    try {
      const response = await api.get('/get-released-courses');
      const { data } = response;

      if (typeof data === 'object') {
        const courses = Object.values(data);

        const categorizedCourses = {};
        courses.forEach(course => {
          if (!categorizedCourses[course.domain]) {
            categorizedCourses[course.domain] = [course];
          } else {
            categorizedCourses[course.domain].push(course);
          }
        });


        setCoursesByDomain(categorizedCourses);
      } else {
        console.error('Invalid response format:', data);
      }
    } catch (error) {
      console.error('Error fetching released courses:', error);
    }
  }

  return (
    <div className="courses">
      <header>
        <h1>Explore and pick courses of your Interests</h1>
      </header>
      <div className="course-categories">
        {Object.entries(coursesByDomain).map(([domain, courses]) => (
          <div className="course-category" key={domain}>
            <h2>{domain}</h2>
            <div className="course-cards">
              {courses.map(course => (
                <div className="course-card" key={course.course_id}>
                  <img src={course.course_thumbnail_url} alt={course.course_name} />
                  <div className="course-details">
                    <h3>{course.course_name}</h3>
                    <p>Educator: {course.educator_name}</p>
                    <p>Price: {course.course_price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Courses;