import React, { useState, useEffect } from 'react';
import {  useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import api from './api';
import './EducatorPreview.css';

function EducatorPreview() {
  const { educator_id } = useParams();
  const [educatorDetails, setEducatorDetails] = useState(null);
  const [courses, setCourses] = useState([]);
  const navigate=useNavigate();

  useEffect(() => {
    fetchEducatorDetails();
  });

  async function fetchEducatorDetails() {
    try {
      const educatorResponse = await api.get(`/educator-preview/${educator_id}`);
      const { data: educatorData } = educatorResponse;

      setEducatorDetails(educatorData.educator);
      setCourses(educatorData.courses);
    } catch (error) {
      console.error('Error fetching educator details:', error);
    }
  }

  if (!educatorDetails) {
    return <p>Loading...</p>;
  }

  return (
    <div className="educator-container">
      <h2>{educatorDetails.name}</h2>
      <img src={educatorDetails.profile_picture} alt={educatorDetails.name} className='educator-photo'/>
      <p><b>About </b><br></br>{educatorDetails.bio}</p>

      <h3 className='course-list'>Courses by {educatorDetails.name}</h3>
       <div className='educator-course-cards'>
        {courses.map(course => (     
          <div className="educator-course-card">
            <img src={course.course_thumbnail_url} alt={course.course_name} onClick={() => navigate(`/course-preview/${course.course_id}`)}/>
            <div className="educator-course-details">
              <h4 onClick={() => navigate(`/course-preview/${course.course_id}`)}>{course.course_name}</h4><br></br>

              <p>Price: {course.course_price}</p>
            </div>
          </div>      
        
      ))}</div>
    </div>
  );
}

export default EducatorPreview;
