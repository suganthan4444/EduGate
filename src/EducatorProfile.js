// LearnerProfile.js

import React, { useEffect, useState } from 'react';
import './EducatorProfile.css';
import api from './api';

function EducatorProfile() {
    const [educatorData, setEducatorData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchProfileData() {
            try {
                const response = await api.get('/educator-profile/');
                setEducatorData(response.data);
            } catch (err) {
                setError('Failed to fetch profile data. Please try again.');
            } finally {
                setLoading(false);
            }
        }

        fetchProfileData();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="profile-container">
            <h2>My Profile</h2>
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
        </div>
    );
}

export default EducatorProfile;
