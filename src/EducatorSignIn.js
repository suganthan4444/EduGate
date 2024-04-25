import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from './api';
import './EducatorSignIn.css';

function EducatorSignIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [csrfToken, setCsrfToken] = useState('');
    const navigate = useNavigate();
    
    
    useEffect(() => {
        async function fetchCsrfToken() {
            try {
                const response = await api.get('/get-educator-csrf-token/');
                setCsrfToken(response.data.csrfToken);
            } catch (error) {
                console.error('Error fetching CSRF token:', error);
                    // Handle error if unable to fetch CSRF token
            }
            }
    
            fetchCsrfToken();
        }, []);
        
        const handleSubmit = async (e) => {
        e.preventDefault();
          try {
            const response = await api.post('/educator-login/', {
                email,
                password}, {headers: {
                    'X-CSRFToken': csrfToken,
                }
            });
            if (response.data.success) {
                const educatorId = response.data.educator_id;
                navigate(`/educator-space/${educatorId}`);
            } else {
                alert(response.data.message);
            }
        } catch (error) {
            console.error('Error during login:', error);
            alert('Failed to login. Please try again.');
        }
    };
    return (
        <div className="educator-component-background">
            <div className="educator-signin">
            <header>
                <h1>Welcome to Educator's Space.</h1>
            </header>
            <div className="container3">
                <h2>Educator Login</h2>
                <form onSubmit={handleSubmit}>
                    <label>Email</label>
                    <input
                        type="text"
                        placeholder="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <br />
                    <label>Password</label>
                    <input
                        type="password"
                        placeholder="Password"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <br />
                    <input type="submit" value="Login" />
                </form>
                <a href="/educator-signup">Don't have an Account? Sign Up</a>
            </div>
            </div>
        </div>
    );
}

export default EducatorSignIn;


