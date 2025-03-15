import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from './api';
import './AddCourse.css';

function AddCourse({ educatorId }) {
    const [courseName, setCourseName] = useState('');
    const [courseDescription, setCourseDescription] = useState('');
    const [courseThumbnail, setCourseThumbnail] = useState(null);
    const [courseDuration, setCourseDuration] = useState('');
    const [coursePrice, setCoursePrice] = useState('');
    const [videoFile, setVideoFile] = useState(null);
    const [exerciseURL, setExerciseURL] = useState('');
    const [courseDomain, setCourseDomain] = useState('');
    const navigate = useNavigate();
    const [csrfToken, setCsrfToken] = useState('');

    useEffect(() => {
        async function fetchCsrfToken() {
            try {
                const response = await api.get('/get-educator-csrf-token/');
                setCsrfToken(response.data.csrfToken);
            } catch (error) {
                console.error('Error fetching CSRF token:', error);
            }
            }
    
            fetchCsrfToken();
        }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            const educatorId = sessionStorage.getItem('educatorId');
            const educatorName = sessionStorage.getItem('educatorName');
            formData.append('educatorName', educatorName);
            formData.append('educatorId', educatorId);
            formData.append('courseName', courseName);
            formData.append('courseDescription', courseDescription);
            formData.append('courseDuration', courseDuration);
            formData.append('courseDomain', courseDomain)
            formData.append('coursePrice', coursePrice);
            formData.append('exerciseURL', exerciseURL);
            formData.append('courseThumbnail', courseThumbnail);
            formData.append('videoFile', videoFile);

            const response = await api.post('/add-educator-courses/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'X-csrfToken' : csrfToken, 
                }
            });

            window.alert(response.data.message);
            if (response.status === 201) {
                navigate(`/educator-courses/${educatorId}`);

        } }
        catch (error) {
            console.error('Error adding course:', error);
        }
    };

    return (
        <div className="add-course-container">
            <div className="add-course">
                <h2 className='head'>Add Course</h2>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="courseName">Course Name:</label>
                    <input type="text" id="courseName" value={courseName} onChange={(e) => setCourseName(e.target.value)} required  style={{ marginBottom: '10px' }}/><br />
                    <label htmlFor="courseDescription" >Course Description:</label><br></br>
                    <textarea id="courseDescription" value={courseDescription} onChange={(e) => setCourseDescription(e.target.value)} required  style={{ marginBottom: '10px', marginTop:'10px' }}/><br />
                    <label htmlFor="courseDomain">Course Domain:</label>
                    <select id="courseDomain" value={courseDomain} onChange={(e) => setCourseDomain(e.target.value)} required style={{ marginBottom: '10px' }}>
                    <option value="">Select Domain</option>
                    <option value="IT & Software">IT & Software</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Mechanics">Mechanics</option>
                    <option value="Aeronautics">Aeronautics</option>
                    <option value="Music">Music</option>
                    <option value="Drawing & Design">Drawing & Design</option>
                    <option value="Management">Management</option>
                    </select><br />
                    
                    <label htmlFor="courseThumbnail">Course Thumbnail:</label>
                    <input type="file" id="courseThumbnail" accept="image/*" onChange={(e) => setCourseThumbnail(e.target.files[0])} required style={{ marginBottom: '10px' }}/><br />
                    <label htmlFor="courseDuration">Course Duration:</label>
                    <input type="text" id="courseDuration" value={courseDuration} onChange={(e) => setCourseDuration(e.target.value)} required style={{ marginBottom: '10px' }}/><br />
                    <label htmlFor="coursePrice">Course Price:</label>
                    <input type="text" id="coursePrice" value={coursePrice} onChange={(e) => setCoursePrice(e.target.value)} required style={{ marginBottom: '10px' }}/><br />
                    <label htmlFor="videoFile">Video File:</label>
                    <input type="file" id="videoFile" accept="video/*" onChange={(e) => setVideoFile(e.target.files[0])} required style={{ marginBottom: '10px' }}/><br />
                    <label htmlFor="exerciseURL">Exercise URL</label>
                    <input type="text" id="exerciseURL" value={exerciseURL} onChange={(e) => setExerciseURL(e.target.value)} required style={{ marginBottom: '10px' }}/><br />
                    <button type="submit" className="submit-button">Submit</button>
                </form>
            </div>
        </div>
    );
}

export default AddCourse;
