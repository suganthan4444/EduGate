// Import necessary libraries and modules
import React, { useState, useEffect } from 'react';
import './LearnerSignUp.css';
import api from './api';
import { debounce } from 'lodash';

function LearnerSignUp() {
    // Define state variables for form data, OTP, loading status, and error fields
    const [formData, setFormData] = useState({
        name: '',
        dob: '',
        highest_qualification: '',
        email: '',
        mobile_no: '',
        username: '',
        password: '',
    });

    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [isOtpVerified, setIsOtpVerified] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorFields, setErrorFields] = useState({
        email: '',
        mobile_no: '',
        username: '',
    });
    
    const [passwordErrors, setPasswordErrors] = useState([]);
    const [csrfToken, setCsrfToken] = useState('');

    const [usernameAvailable, setUsernameAvailable] = useState(null); // Initialize as null

    useEffect(() => {
        async function fetchCsrfToken() {
            try {
                const response = await api.get('/get-learner-csrf-token/');
                setCsrfToken(response.data.csrfToken);
            } catch (error) {
                console.error('Error fetching CSRF token:', error);
                // Handle error if unable to fetch CSRF token
            }
        }

        fetchCsrfToken();
    }, []);

// Function to handle username availability check
const debouncedCheckLearnerUsernameAvailability = debounce(async (username) => {
    // Return early if the username is empty
    if (!username) {
        setUsernameAvailable(null); // Reset availability state
        setErrorFields((prevFields) => ({
            ...prevFields,
            username: 'Username cannot be empty.',
        }));
        return;
    }

    try {
        // Make a POST request to check username availability
        const response = await api.post('/check-learner-username-availability/', {
            username, headers: {
                'X-CSRFToken': csrfToken,
            }
        });

        // Handle the response data
        const isUnique = response.data.username.is_unique;
        setUsernameAvailable(isUnique);

        // Update error fields and error message based on availability
        if (isUnique) {
            setErrorFields((prevFields) => ({
                ...prevFields,
                username: '', // Clear any previous error
            }));
        } else {
            setErrorFields((prevFields) => ({
                ...prevFields,
                username: response.data.username.message || 'Username is unavailable.',
            }));
        }
    } catch (error) {
        // Handle any error during the request
        console.error('Error checking username:', error);
        setErrorFields((prevFields) => ({
            ...prevFields,
            username: 'Error checking username. Please try again.',
        }));
        setUsernameAvailable(false);
    }
}, 300);

const debouncedCheckLearnerUniqueFields = debounce(async (email, mobile_no) => {
    try {
        const response = await api.post('/check-learner-unique-fields/', {
            email,
            mobile_no
        },{headers: {
            'X-CSRFToken': csrfToken,
        }}
    );

        setErrorFields({
            email: response.data.email.is_unique ? '' : response.data.email.message,
            mobile_no: response.data.mobile_no.is_unique ? '' : response.data.mobile_no.message
        });
    } catch (error) {
        console.error('Error checking unique fields:', error);
        setErrorFields({
            email: 'Error checking email. Please try again.',
            mobile_no: 'Error checking mobile number. Please try again.'
        });
    }
}, 300);

    function validatePassword(password) {
        const minLength = 8;
        const hasUppercase = /[A-Z]/.test(password);
        const hasLowercase = /[a-z]/.test(password);
        const hasSpecialCharacter = /[!@#$%^&*()-_=+[\]{};':"\\|,.<>/?~`]/.test(password);
    
        let errorMessages = [];
    
        if (password.length < minLength) {
            errorMessages.push('Password must be at least 8 characters long.');
        }
        if (!hasUppercase) {
            errorMessages.push('Password must contain at least one uppercase letter.');
        }
        if (!hasLowercase) {
            errorMessages.push('Password must contain at least one lowercase letter.');
        }
        if (!hasSpecialCharacter) {
            errorMessages.push('Password must contain at least one special character.');
        }
    
        return errorMessages;
    }

    // Handle input change events
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    
        // Handle real-time username availability check
        if (name === 'username') {
            debouncedCheckLearnerUsernameAvailability(value);
        }
    
        // Trigger password validation when password changes
        if (name === 'password') {
            const errors = validatePassword(value);
            setPasswordErrors(errors);
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
    
        // Check for password errors
        if (passwordErrors.length > 0) {
            alert('Please fix password errors before submitting.');
            return;
        }
    
        // Extract email and mobile_no from formData
        const { email, mobile_no } = formData;
    
        // Check learner unique fields
        await debouncedCheckLearnerUniqueFields(email, mobile_no);
    
        // If there are any errors in email or mobile_no, display the error messages
        // below the corresponding fields and stop form submission
        if (errorFields.email) {
            alert(errorFields.email); // Alert the error message
            return;
        }
        if (errorFields.mobile_no) {
            alert(errorFields.mobile_no); // Alert the error message
            return;
        }
    
        // If all unique field checks pass, proceed to send OTP
        setIsLoading(true);
        try {
            const response = await api.post('/learner-send-otp/', { email },{headers: {
                'X-CSRFToken': csrfToken,
            }});
            alert(response.data.message);
            setOtpSent(true);
        } catch (error) {
            console.error('Error sending OTP:', error);
            alert('Failed to send OTP. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };
    
    

        // Handle OTP verification
    const handleOTPVerification = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await api.post('/learner-verify-otp/', {
                email: formData.email,
                otp: otp,
            });

            if (response.data.success) {
                setIsOtpVerified(true);
                alert('OTP verified successfully!');
                // Proceed to learner signup
                await handleLearnerSignup();
            } else {
                alert('Incorrect OTP. Please try again.');
            }
        } catch (error) {
            console.error('Error verifying OTP:', error);
            alert('Error verifying OTP. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendOTP = async () => {
        setIsLoading(true);
        try {
            const response = await api.post('/learner-send-otp/', {
                email: formData.email,
            });
            alert(response.data.message);
            setOtpSent(true);
            setOtp(''); // Clear OTP input
        } catch (error) {
            console.error('Error sending OTP:', error);
            alert('Failed to send OTP. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    // Handle learner sign-up
    const handleLearnerSignup = async () => {
        try {
            // Prepare data to send
            const dataToSend = {
                ...formData,
                otp: otp,
            };

            // Make a POST request to the learner signup endpoint
            const response = await api.post('/learner-signup/', dataToSend);

            // Handle the response
            if (response.status === 201) {
                alert('Learner signed up successfully!');
                // Perform any other navigation or state updates as needed
            } else {
                alert(`Error: ${response.data.message}`);
            }
        } catch (error) {
            console.error('Error during signup:', error);
            alert('Error during signup. Please try again.');
        }
    };


    return (
        <div className="learner-component-background">
            <div className="container4">
            <h2>Learner Sign Up</h2>
            {isLoading && <p>Loading...</p>}
            {!isOtpVerified ? (
                <>
                    {otpSent ? (
                        <form onSubmit={handleOTPVerification}>
                            <label>Enter OTP</label>
                            <input
                                type="text"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                required
                            />
                            <input type="submit" value="Verify OTP" />
                            <button type="button" onClick={handleResendOTP}>
                                Resend OTP
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleSubmit}>
                        
                            <label>Full Name</label>
                            <input
                                type="text"
                                name="name"
                                placeholder="e.g. Thomas Alva Edison"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                            />
                            <br />

                            <label>Date of Birth</label>
                            <input
                                type="date"
                                name="dob"
                                value={formData.dob}
                                onChange={handleInputChange}
                                required
                            />
                            <br />

                            <label>Highest Qualification</label>
                            <select
                                name="highest_qualification"
                                value={formData.highest_qualification}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="" disabled>
                                    Select your qualification
                                </option>
                                <option value="Grade 1">Grade 1</option>
                                <option value="Grade 2">Grade 2</option>
                                <option value="Grade 3">Grade 3</option>
                                <option value="Grade 4">Grade 4</option>
                                <option value="Grade 5">Grade 5</option>
                                <option value="Grade 6">Grade 6</option>
                                <option value="Grade 7">Grade 7</option>
                                <option value="Grade 8">Grade 8</option>
                                <option value="Grade 9">Grade 9</option>
                                <option value="Grade 10">Grade 10</option>
                                <option value="Grade 11">Grade 11</option>
                                <option value="Grade 12">Grade 12</option>
                                <option value="B.A.">Bachelor of Arts (B.A.)</option>
                                <option value="B.Sc.">Bachelor of Science (B.Sc.)</option>
                                <option value="B.Com">Bachelor of Commerce (B.Com)</option>
                                <option value="B.E.">Bachelor of Engineering (B.E.)</option>
                                <option value="B.Tech">Bachelor of Technology (B.Tech)</option>
                                <option value="B.Pharm">Bachelor of Pharmacy (B.Pharm)</option>
                                <option value="B.Arch">Bachelor of Architecture (B.Arch)</option>
                                <option value="BBA">Bachelor of Business Administration (BBA)</option>
                                <option value="BCA">Bachelor of Computer Applications (BCA)</option>
                                <option value="MBBS">Bachelor of Medicine, Bachelor of Surgery (MBBS)</option>
                                <option value="BDS">Bachelor of Dental Surgery (BDS)</option>
                                <option value="B.V.Sc.">Bachelor of Veterinary Science (B.V.Sc.)</option>
                                <option value="LL.B">Bachelor of Laws (LL.B)</option>
                                <option value="M.A.">Master of Arts (M.A.)</option>
                                <option value="M.Sc.">Master of Science (M.Sc.)</option>
                                <option value="M.Com">Master of Commerce (M.Com)</option>
                                <option value="M.E.">Master of Engineering (M.E.)</option>
                                <option value="M.Tech">Master of Technology (M.Tech)</option>
                                <option value="MBA">Master of Business Administration (MBA)</option>
                                <option value="MCA">Master of Computer Applications (MCA)</option>
                                <option value="MD">Doctor of Medicine (MD)</option>
                                <option value="MS">Master of Surgery (MS)</option>
                                <option value="M.Pharm">Master of Pharmacy (M.Pharm)</option>
                                <option value="LL.M">Master of Laws (LL.M)</option>
                                <option value="Ph.D">Doctor of Philosophy (Ph.D)</option>
                            </select>
                            <br></br>
                            <label>Email</label>
                            <input
                                type="text"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                onSubmit={handleSubmit}
                                required
                            />
                            {errorFields.email && <span style={{ color: 'red' }}>{errorFields.email}</span>}
                            <br />

                            <label>Mobile No</label>
                            <input
                                type="text"
                                name="mobile_no"
                                value={formData.mobile_no}
                                onChange={handleInputChange}
                                onSubmit={handleSubmit}
                                required
                            />
                            {errorFields.mobile_no && <span style={{ color: 'red' }}>{errorFields.mobile_no}</span>}
                            <br />

                            <label>Username</label>
                            <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleInputChange}
                            required
                            />
                            {errorFields.username && <span style={{ color: 'red' }}>{errorFields.username}</span>}
{usernameAvailable && (
    <p style={{ color: 'green' }}>Username is available.</p>
)}
{usernameAvailable === false && !errorFields.username && (
    <p style={{ color: 'red' }}>Username is unavailable.</p>
)}
                            <br />

                            <label>Password</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                required
                            />
                            {passwordErrors.map((error, index) => (
                                <p key={index} style={{ color: 'red' }}>
                                    {error}
                                </p>
                            ))}
                            <br />

                            <input type="submit" value="Sign Up" />
                        </form>
                    )}
                    <a href="/learner-signin">Already have an Account? Sign In</a>
                </>
            ) : (
                <div>
                    <p>OTP verified successfully! Proceed with the next steps.</p>
                </div>
            )}
            </div>
        </div>
   );
}
export default LearnerSignUp;