// EducatorProfile.js

import React, { useEffect, useState } from 'react';
import './EducatorProfile.css';
import api from './api';
import { Link, useNavigate } from 'react-router-dom';

function EducatorProfile() {
    const [educatorData, setEducatorData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [csrfToken, setCsrfToken] = useState('');
    const navigate = useNavigate();
    const educatorId = sessionStorage.getItem('educatorId');

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
                const educatorId = sessionStorage.getItem('educatorId');
                const response = await api.get(`/educator-profile/?educatorId=${educatorId}`,{headers: {
                    'X-CSRFToken': csrfToken,
                }});
                setEducatorData(response.data);
            } catch (err) {
                setError('Failed to fetch profile data. Please try again.');
            } finally {
                setLoading(false);
            }
        }

        fetchProfileData();
    }, [csrfToken]);

    const linkStyle = {
        textDecoration: 'none',
        color: 'inherit',
    };
    
    const confirmLogout = () => {
        const userConfirmed = window.confirm('Are you sure you want to log out?');
        if (userConfirmed) {
            sessionStorage.clear();
            navigate('/home');
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (

    <div className="educator-space">
        <nav className="sidebar">
            <ul>
                <li>
                    <Link to={`/educator-profile/${educatorId}`} style={linkStyle}>Your Profile</Link>
                </li>
                <li>
                    <Link to={`/educator-courses/${educatorId}`} style={linkStyle}>Your Courses</Link>
                </li>
            </ul>
            <button onClick={confirmLogout}>Logout</button>
        </nav>
        <div className="profile-container">
            <h2>My Profile</h2>
            <div className='educator-picture'><img src={educatorData.profile_picture} alt={educatorData.name}></img></div>
            <div className="profile-field">
                <label>Name:</label>
                <input type="text" value={educatorData.name} readOnly />
            </div>
            <div className="profile-field">
                <label>Date of Birth:</label>
                <input type="text" value={educatorData.dob} readOnly />
            </div>
            <div className="profile-field">
                <label>Email:</label>
                <input type="text" value={educatorData.email} readOnly />
            </div>
            <div className="profile-field">
                <label>Mobile Number:</label>
                <input type="text" value={educatorData.mobile_no} readOnly />
            </div>
            <div className="profile-field">
                <label>Highest Qualification:</label>
                <input type="text" value={educatorData.highest_qualification} readOnly />
            </div>
            <div className="profile-field">
                <label>Username:</label>
                <input type="text" value={educatorData.username} readOnly />
            </div>
            <div className="profile-field">
                <label>Bio:</label>
                <input type="text" value={educatorData.bio} readOnly />
            </div>
        </div>
        </div>
    );
}

export default EducatorProfile;
