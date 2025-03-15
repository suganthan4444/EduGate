import React, { useEffect, useState } from 'react';
import './LearnerProfile.css';
import api from './api';
import { useNavigate, Link } from 'react-router-dom';

function LearnerProfile() {
    const learnerId = sessionStorage.getItem('learnerId');
    const [learnerData, setLearnerData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [csrfToken, setCsrfToken] = useState('');
    const navigate = useNavigate();

    const confirmLogout = () => {
        const userConfirmed = window.confirm('Are you sure you want to log out?');
        if (userConfirmed) {
            sessionStorage.clear();
            navigate('/home');
        }
    };

    const linkStyle = {
        textDecoration: 'none',
        color: 'inherit',
    };

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
        async function fetchProfileData() {
            try {
                const learnerId = sessionStorage.getItem('learnerId');
                const response = await api.get(`/learner-profile/?learnerId=${learnerId}`,{headers: {
                    'X-CSRFToken': csrfToken,
                }});
                setLearnerData(response.data);
            } catch (err) {
                setError('Failed to fetch profile data. Please try again.');
            } finally {
                setLoading(false);
            }
        }

        fetchProfileData();
    }, [csrfToken]);




    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className='profile'>
        <div className='learner-navbar'>
            <nav className="learner-sidebar">
                <ul>
                    <li>
                        <Link to={`/learner-profile/${learnerId}`} style={linkStyle}>Your Profile</Link>
                    </li>
                    <li>
                        <Link to={`/learner-courses/${learnerId}`} style={linkStyle}>Your Courses</Link>
                    </li>
                </ul>
                <button onClick={confirmLogout}>Logout</button>
            </nav>
            </div>
        <div className="profile-container">
            <h2>My Profile</h2>
            <div className='learner-picture'><img src={learnerData.profile_picture} alt={learnerData.name}></img></div>
            <div className="profile-field">
                <label>Name:</label>
                <input type="text" value={learnerData.name} readOnly />
            </div>
            <div className="profile-field">
                <label>Date of Birth:</label>
                <input type="text" value={learnerData.dob} readOnly />
            </div>
            <div className="profile-field">
                <label>Email:</label>
                    <input
                        type="text"
                        value={learnerData.email} readOnly
                    />
            </div>
            <div className="profile-field">
                <label>Mobile Number:</label>
               
                    <input
                        type="text"
value={learnerData.mobile_no} readOnly                    
                    />
            </div>
            <div className="profile-field">
                <label>Highest Qualification:</label>
              
                    <input
                        type="text"
                        name="highest_qualification"
                       value={learnerData.highest_qualification} readOnly
                    />
            </div>
            <div className="profile-field">
                <label>Username:</label>
               
                    <input
                        type="text"
                        name="username"
                       value={learnerData.username} readOnly
                    />
            </div>
        </div></div>
    );
}

export default LearnerProfile;
