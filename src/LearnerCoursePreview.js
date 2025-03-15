

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from './api';
import './CoursePreview.css';

function CoursePreview() {
  const { course_id } = useParams();
  const [courseDetails, setCourseDetails] = useState(null); 

  useEffect(() => {

    async function fetchCourseDetails() {
      try {
        const response = await api.get(`/course-preview/${course_id}`);
        const { data } = response;
        setCourseDetails(data); 
      } catch (error) {
        console.error('Error fetching course details:', error);
      }
    }

    fetchCourseDetails(); 
  }, [course_id]);

  return (
    <div className="course-preview-container">
      {courseDetails ? (
        <div className="course-preview-details">
          <h2>{courseDetails.course_name}</h2>
          <img src={courseDetails.course_thumbnail_url} alt={courseDetails.course_name} />
          <p>Description: {courseDetails.course_description}</p>
          <p>Educator: {courseDetails.educator_name}</p>
          <p>Duration: {courseDetails.course_duration}</p>
          <p>Domain: {courseDetails.course_domain}</p>
          <p>Price: {courseDetails.course_price}</p><br></br>
          <a href={`/enroll-course/${course_id}`}>Buy this course</a>
        </div>

        

      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default CoursePreview;
