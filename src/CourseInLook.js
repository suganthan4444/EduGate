import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from './api';
import './CourseInLook.css';

function CourseInLook() {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCourse() {
      try {
        const response = await api.get(`/educator-course-inlook/${courseId}`);
        setCourse(response.data);
      } catch (error) {
        console.error('Error fetching course:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchCourse();
  }, [courseId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!course) {
    return <div>Course not found</div>;
  }

  return (
    <div className="course-details">
      <img src={course.course_thumbnail} alt={course.course_name} /><br></br>
      <h2 className="course-name">{course.course_name}</h2><br></br>
      <p className="educator-name">Educator: <b>{course.educator_name}</b></p><br></br>
      <p className="duration">Duration: <b>{course.course_duration}</b></p><br></br>
      <p className="description"><b>Description: </b><br></br>{course.course_description}</p><br></br>
      {course.course_video && (
  <div className="video-container" onContextMenu={(e) => e.preventDefault()}>
    <video
      title="Course Video"
      width="560"
      height="315"
      src={course.course_video}
      frameBorder="0"
      controls
      controlsList="nodownload"
      allowFullScreen
    ></video><br></br>
  </div>
)}
<div><br></br>
      <p className="exercise">Exercise Link: <a href={course.course_exercise}>Click here for Course Excsercise</a></p></div>
    </div>
  );
}

export default CourseInLook;
