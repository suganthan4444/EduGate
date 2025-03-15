import React, { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import './EnrollCourse.css';
import api from './api';

function EnrollCourse() {
  const { course_id } = useParams(); 
  const learner_id = sessionStorage.getItem('learnerId');
  const [learnerName, setLearnerName] = useState('');
  const [courseDetails, setCourseDetails] = useState(null);
  console.log({course_id})

  useEffect(() => {
    async function fetchLearnerName() {
      try {
        const response = await api.get(`/get-learner-name/${learner_id}`);
        const { learner_name } = response.data;
        setLearnerName(learner_name); 
      } catch (error) {
        console.error('Error fetching learner name:', error);
      }
    }

    fetchLearnerName();
  }, [learner_id]);

  useEffect(() => {
    async function fetchCourseDetails() {
      try {
        const response = await api.get(`/get-course-details/${course_id}`);
        const { data } = response;
        setCourseDetails(data);
      } catch (error) {
        console.error('Error fetching course details:', error);
      }
    }

    fetchCourseDetails(); 
  }, [course_id]);

  const handleEnroll = async () => {
    try {
      await api.post('/enroll-course/', {
        learner_id:learner_id,
        learner_name: learnerName,
        course_id:course_id,
        course_name: courseDetails.course_name,
        educator_id: courseDetails.educator_id,
        educator_name: courseDetails.educator_name,
        course_description: courseDetails.course_description,
        course_duration: courseDetails.course_duration,
        course_domain: courseDetails.course_domain,
        course_thumbnail: courseDetails.course_thumbnail_url,
        course_video_id: courseDetails.course_video_id,
        course_video: courseDetails.course_video_url,
        course_exercise_id: courseDetails.course_exercise_id,
        course_exercise_url: courseDetails.course_exercise_url,
        course_purchase_status: false 
      });

      alert('Course purchase requested!');
      Navigate('/learner-courses');
    } catch (error) {
      console.error('Error enrolling in course:', error);
      alert('Failed to enroll in the course. Please try again.');
    }
  };

  return (
    <div>
      <h2>Confirm Enrollment</h2>
      <p>Learner Name: {learnerName}</p>
      {courseDetails && (
        <div className='enrollcourse'>
          <p>Course Name: {courseDetails.course_name}</p>
          <p>Course Description: {courseDetails.course_description}</p>
          <p>Course Duration: {courseDetails.course_duration}</p>
          <p>Course Domain: {courseDetails.course_domain}</p>
          <p>Course Thumbnail: <img src={courseDetails.course_thumbnail_url} alt={courseDetails.course_name} /></p>
          <button onClick={handleEnroll}>Confirm Enroll</button>
        </div>
      )}
    </div>
  );
}

export default EnrollCourse;
