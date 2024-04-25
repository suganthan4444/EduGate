import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function LearnerSpace() {
    const learnerId = sessionStorage.getItem('learnerId');
    const navigate = useNavigate();

    // Function to handle the logout process
    const confirmLogout = () => {
        const userConfirmed = window.confirm('Are you sure you want to log out?');
        if (userConfirmed) {
            // Clear user data from session or local storage
            sessionStorage.clear();
            // Redirect the user to the home page
            navigate('/home');
        }
    };

    // Define the style to remove underline from links
    const linkStyle = {
        textDecoration: 'none',
        color: 'inherit',
    };

    return (
        <div className="learner-space">
            <nav className="sidebar">
                <ul>
                    {/* Use the learnerId in the links */}
                    <li>
                        <Link to={`/learner-profile/${learnerId}`} style={linkStyle}>Your Profile</Link>
                    </li>
                    <li>
                        <Link to={`/learner-courses/${learnerId}`} style={linkStyle}>Your Courses</Link>
                    </li>
                </ul>
                {/* Logout button */}
                <button onClick={confirmLogout}>Logout</button>
            </nav>
        </div>
    );
}

export default LearnerSpace;
