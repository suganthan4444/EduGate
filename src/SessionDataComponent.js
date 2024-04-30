import React, { useState, useEffect } from 'react';
import { fetchSessionData } from './api';

const SessionDataComponent = () => {
    const [sessionData, setSessionData] = useState(null);

    useEffect(() => {
        const getSessionData = async () => {
            const data = await fetchSessionData();
            setSessionData(data);
        };

        getSessionData();
    }, []);

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
