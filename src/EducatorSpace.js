import React from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

function EducatorSpace() {
    const { educatorId } = useParams();
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

    return (
        <div className="educator-space">
            <nav className="sidebar1">
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
        </div>
    );
}

export default EducatorSpace;
