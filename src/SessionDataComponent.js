import React, { useState, useEffect } from 'react';
import { fetchSessionData } from './api';

const SessionDataComponent = () => {
    const [sessionData, setSessionData] = useState(null);

    useEffect(() => {
        // Fetch session data when component mounts
        const getSessionData = async () => {
            const data = await fetchSessionData();
            setSessionData(data);
        };

        getSessionData();
    }, []);

    // Display the session data
    return (
        <div>
            <h3>Session Data</h3>
            {sessionData ? (
                <div>
                    <p>OTP: {sessionData.otp}</p>
                    <p>Email: {sessionData.email}</p>
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default SessionDataComponent;
