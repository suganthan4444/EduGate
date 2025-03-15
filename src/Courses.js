import React, { useState, useEffect } from 'react';
import api from './api';
import './Courses.css';
import { useNavigate } from 'react-router-dom'; 

function Courses() {
  const [coursesByDomain, setCoursesByDomain] = useState({});
  const [selectedDomain, setSelectedDomain] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');
  const navigate = useNavigate();


  useEffect(() => {
    fetchReleasedCourses();
  }, []);

  async function fetchReleasedCourses() {
    try {
      const response = await api.get('/get-released-courses');
      const { data } = response;
  
      if (typeof data === 'object') {
        setCoursesByDomain(data);
      } else {
        console.error('Invalid response format:', data);
      }
    } catch (error) {
      console.error('Error fetching released courses:', error);
    }
  }
  

  const handleDropdownChange = (event) => {
    setSelectedDomain(event.target.value);
  };


  const handleSearchChange = (event) => {
    setSearchKeyword(event.target.value);
  };

  return (
    <div className="courses">
      <header>
        <h1>Explore and pick courses of your Interests</h1>
        <select value={selectedDomain} onChange={handleDropdownChange}>
          <option value="">Select Domain</option>
          <option value="IT & Software">IT & Software</option>
          <option value="Electronics">Electronics</option>
          <option value="Mechanics">Mechanics</option>
          <option value="Aeronautics">Aeronautics</option>
          <option value="Music">Music</option>
          <option value="Drawing & Design">Drawing & Design</option>
          <option value="Management">Management</option>
        </select>
        <input type="text" placeholder="Search courses..." value={searchKeyword} onChange={handleSearchChange} />
      </header>
      <div className="course-categories">
  {Object.entries(coursesByDomain).map(([domain, courses]) => (
    (!selectedDomain || domain === selectedDomain) && (
      <div key={domain}>
        {domain && <h2 className='domain'>{domain}</h2>}
        <div className="course-cards">
          {courses
            .filter(
              course =>
                course.course_name &&
                course.course_name.toLowerCase().includes(searchKeyword.toLowerCase())
            )
            .map(course => (
              <div className="user-course-card" key={course.course_id} >
                <img src={course.course_thumbnail_url} alt={course.course_name} onClick={() => navigate(`/course-preview/${course.course_id}`)}/>
                <div className="user-course-details">
                  <h3 onClick={() => navigate(`/course-preview/${course.course_id}`)}>{course.course_name}</h3>
                  <p className='educator' onClick={() => navigate(`/educator-preview/${course.educator_id}`)}>by <span>{course.educator_name}</span></p>
                  <p className='price' >Price: {course.course_price}</p>
                </div>
              </div>
            ))}
          {courses
            .filter(
              course =>
                course.course_name &&
                course.course_name.toLowerCase().includes(searchKeyword.toLowerCase())
            ).length === 0 && (
            <p>No courses available with this name.</p>
          )}
        </div>
      </div>
    )
  ))}
</div>
    </div>
  );
}

export default Courses;
