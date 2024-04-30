import React from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

function EducatorSpace() {
    // Use useParams hook to get the learnerId from the URL
    const { educatorId } = useParams();
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
        <div className="educator-space">
            <nav className="sidebar1">
                <ul>
                    {/* Use the learnerId in the links */}
                    <li>
                        <Link to={`/educator-profile/${educatorId}`} style={linkStyle}>Your Profile</Link>
                    </li>
                    <li>
                        <Link to={`/educator-courses/${educatorId}`} style={linkStyle}>Your Courses</Link>
                    </li>
                </ul>
                {/* Logout button */}
                <button onClick={confirmLogout}>Logout</button>
            </nav>
        </div>
    );
}

export default EducatorSpace;
