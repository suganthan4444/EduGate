//EducatorSignUp.js
import React from 'react';
import './EducatorSignUp.css';

function EducatorSignUp() {
    
    return (
        <div className="container2">
            <h2>Educator Sign Up</h2>
            <form >
            <label>Full Name</label><input type="text" id="fullname" name="educator-name" placeholder="eg.Thomas Alva Edison" required  /><br></br>
            <label>Date of Birth</label><input type="date" id="dob" name="date-of-birth" required  /><br></br>
            <label>Qualification</label><input type="text" id="qualification" name="qualification" placeholder="eg.B.E, B.Tech,etc" required  /><br></br>
            <label>Username</label><input type="text" id="username" name="user-name"placeholder="Username" required  /><br></br>
            <label>Password</label><input type="password" id="pwd" name="password" placeholder="Password" required  /><br></br>
            <input type="submit" value="Sign Up" />
            </form>
            <a href="/educator-signin">Already have an Account? Sign In</a>
        </div>
    );
}

export default EducatorSignUp;
