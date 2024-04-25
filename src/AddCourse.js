import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from './api';
import './AddCourse.css';

function AddCourse({ educatorId }) {
    const [courseName, setCourseName] = useState('');
    const [courseDescription, setCourseDescription] = useState('');
    const [courseThumbnail, setCourseThumbnail] = useState('');
    const [courseDuration, setCourseDuration] = useState('');
    const [coursePrice, setCoursePrice] = useState('');
    const [videoUrl, setVideoUrl] = useState('');
    const [exerciseName, setExerciseName] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Make API request to add course
            await api.post('/add-course', {
                educatorId,
                courseName,
                courseDescription,
                courseThumbnail,
                courseDuration,
                coursePrice,
                videoUrl,
                exerciseName
            });
            // Navigate to educator courses page
            navigate(`/educator-courses/${educatorId}`);
        } catch (error) {
            console.error('Error adding course:', error);
            // Handle error
        }
    };

    return (
        <div className="add-course-container">
            <div className="add-course">
            <h2>Add Course</h2>
            <form onSubmit={handleSubmit}>
                <label htmlFor="courseName">Course Name:</label>
                <input type="text" id="courseName" value={courseName} onChange={(e) => setCourseName(e.target.value)} required /><br></br>
                <label htmlFor="courseDescription">Course Description:</label>
                <textarea id="courseDescription" value={courseDescription} onChange={(e) => setCourseDescription(e.target.value)} required /><br></br>
                <label htmlFor="courseThumbnail">Course Thumbnail URL:</label>
                <input type="text" id="courseThumbnail" value={courseThumbnail} onChange={(e) => setCourseThumbnail(e.target.value)} required /><br></br>
                <label htmlFor="courseDuration">Course Duration:</label>
                <input type="text" id="courseDuration" value={courseDuration} onChange={(e) => setCourseDuration(e.target.value)} required /><br></br>
                <label htmlFor="coursePrice">Course Price:</label>
                <input type="text" id="coursePrice" value={coursePrice} onChange={(e) => setCoursePrice(e.target.value)} required /><br></br>
                <label htmlFor="videoUrl">Video URL:</label>
                <input type="text" id="videoUrl" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} required /><br></br>
                <label htmlFor="exerciseName">Exercise Name:</label>
                <input type="text" id="exerciseName" value={exerciseName} onChange={(e) => setExerciseName(e.target.value)} required /><br></br>
                <button type="submit" className="submit-button">Submit</button>
            </form>
            </div>
        </div>
    );
}

export default AddCourse;
