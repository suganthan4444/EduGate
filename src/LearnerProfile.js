// LearnerProfile.js

import React, { useEffect, useState } from 'react';
import './LearnerProfile.css';
import api from './api';

function LearnerProfile() {
    const [learnerData, setLearnerData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const learnerId = sessionStorage.getItem('learnerId');

    useEffect(() => {
        async function fetchProfileData() {
            try {
                const response = await api.get('/learner-profile/', { learner_id: learnerId });
                setLearnerData(response.data);
            } catch (err) {
                setError('Failed to fetch profile data. Please try again.');
            } finally {
                setLoading(false);
            }
        }

        fetchProfileData();
    }, [learnerId]);

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
                <input type="text" value={learnerData.name} readOnly />
            </div>
            <div className="profile-field">
                <label>Date of Birth:</label>
                <input type="text" value={learnerData.dob} readOnly />
            </div>
            <div className="profile-field">
                <label>Email:</label>
                <input type="text" value={learnerData.email} readOnly />
            </div>
            <div className="profile-field">
                <label>Mobile Number:</label>
                <input type="text" value={learnerData.mobile_no} readOnly />
            </div>
            <div className="profile-field">
                <label>Highest Qualification:</label>
                <input type="text" value={learnerData.highest_qualification} readOnly />
            </div>
            <div className="profile-field">
                <label>Username:</label>
                <input type="text" value={learnerData.username} readOnly />
            </div>
        </div>
    );
}

export default LearnerProfile;
