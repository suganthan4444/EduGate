import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminHome.css';

function AdminHome() {
    const navigate = useNavigate();

    const handleViewEducators = () => {
        navigate('/admin-educators');
    };

    const handleViewLearners = () => {
        navigate('/admin-learners');
    };

    const handleViewCourseRequests = () => {
        navigate('/admin-courses');
    };

    return (
        <div className="admin-home-container">
            <h1 className="admin-welcome">Welcome Admin</h1>
            <div className="admin-buttons">
                <button onClick={handleViewLearners} className="admin-button">Learner Courses</button>
                <button onClick={handleViewCourseRequests} className="admin-button">Educator Courses</button>
            </div>
        </div>
    );
}

export default AdminHome;
