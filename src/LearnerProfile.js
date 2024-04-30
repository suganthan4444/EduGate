import React, { useEffect, useState } from 'react';
import './LearnerProfile.css';
import api from './api';

function LearnerProfile() {
    const [learnerData, setLearnerData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editableFields, setEditableFields] = useState(false);
    const [updatedFields, setUpdatedFields] = useState({});
    const [csrfToken, setCsrfToken] = useState('');

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
                setUpdatedFields(response.data);
            } catch (err) {
                setError('Failed to fetch profile data. Please try again.');
            } finally {
                setLoading(false);
            }
        }

        fetchProfileData();
    }, [csrfToken]);

    const handleEdit = () => {
        setEditableFields(true);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUpdatedFields({ ...updatedFields, [name]: value });
    };

    const handleSubmit = async () => {
        try {
            const learnerId = sessionStorage.getItem('learnerId');
            await api.patch(`/update-learner-profile/${learnerId}`, updatedFields, {
                headers: {
                    'X-CSRFToken': csrfToken,
                },
            });
            setLearnerData(updatedFields);
            setEditableFields(false);
        } catch (err) {
            console.error('Error updating profile:', err);
        }
    };

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
                {editableFields ? (
                    <input
                        type="text"
                        name="email"
                        value={updatedFields.email || learnerData.email}
                        onChange={handleChange}
                    />
                ) : (
                    <input type="text" value={learnerData.email} readOnly />
                )}
            </div>
            <div className="profile-field">
                <label>Mobile Number:</label>
                {editableFields ? (
                    <input
                        type="text"
                        name="mobile_no"
                        value={updatedFields.mobile_no || learnerData.mobile_no}
                        onChange={handleChange}
                    />
                ) : (
                    <input type="text" value={learnerData.mobile_no} readOnly />
                )}
            </div>
            <div className="profile-field">
                <label>Highest Qualification:</label>
                {editableFields ? (
                    <input
                        type="text"
                        name="highest_qualification"
                        value={updatedFields.highest_qualification || learnerData.highest_qualification}
                        onChange={handleChange}
                    />
                ) : (
                    <input type="text" value={learnerData.highest_qualification} readOnly />
                )}
            </div>
            <div className="profile-field">
                <label>Username:</label>
                {editableFields ? (
                    <input
                        type="text"
                        name="username"
                        value={updatedFields.username || learnerData.username}
                        onChange={handleChange}
                    />
                ) : (
                    <input type="text" value={learnerData.username} readOnly />
                )}
            </div>
            {editableFields && (
    <div>
        <button onClick={handleSubmit}>Submit Changes</button>
        <p>Name and Date of Birth can't be edited.</p>
    </div>
)}
            {!editableFields && <button onClick={handleEdit}>Edit Profile</button> }
        </div>
    );
}

export default LearnerProfile;
