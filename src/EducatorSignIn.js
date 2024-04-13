//EducatorSignIn.js
import React, { useState } from 'react';
import './EducatorSignIn.css';
function EducatorSignIn() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Username:', username);
        console.log('Password:', password);
        setUsername('');
        setPassword('');
    };

    return (
        <div className="container1">
            <h2>Educator Login</h2>
            <form onSubmit={handleSubmit}>
                <label>Username</label><input type="text" placeholder="Username" required value={username} onChange={handleUsernameChange}/><br></br>
                <label>Password</label><input type="password" placeholder="Password" required value={password} onChange={handlePasswordChange}/><br></br>
                <input type="submit" value="Login" />
            </form>
            <a href="/educator-signup">Don't have an Account? Sign Up</a>
        </div>
    );
}

export default EducatorSignIn;

