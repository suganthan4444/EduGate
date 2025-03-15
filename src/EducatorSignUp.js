import React, { useState, useEffect } from 'react';
import './EducatorSignUp.css';
import api from './api';
import { debounce } from 'lodash';

    function EducatorSignUp() {
    const [formData, setFormData] = useState({
        name: '',
        dob: '',
        highest_qualification: '',
        email: '',
        mobile_no: '',
        username: '',
        password: '',
        bio: '',
        profile_picture:'',
    });

    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [isOtpVerified, setIsOtpVerified] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorFields, setErrorFields] = useState({
        email: '',
        username: '',
    });
    
    const [passwordErrors, setPasswordErrors] = useState([]);
    const [usernameAvailable, setUsernameAvailable] = useState(null);
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

const debouncedCheckEducatorUsernameAvailability = debounce(async (username) => {
    if (!username) {
        setUsernameAvailable(null);
        setErrorFields((prevFields) => ({
            ...prevFields,
            username: 'Username cannot be empty.',
        }));
        return;
    }

    try {
        const response = await api.post('/check-educator-username-availability/', {
            username, headers: {
                'X-CSRFToken': csrfToken,
            }
        });

        const isUnique = response.data.username.is_unique;
        setUsernameAvailable(isUnique);

        if (isUnique) {
            setErrorFields((prevFields) => ({
                ...prevFields,
                username: '',
            }));
        } else {
            setErrorFields((prevFields) => ({
                ...prevFields,
                username:'Username is already taken, Choose another username',
            }));
        }
        
    } catch (error) {

        console.error('Error checking username:', error);
        setErrorFields((prevFields) => ({
            ...prevFields,
            username: 'Error checking username. Please try again.',
        }));
        setUsernameAvailable(false);
    }
}, 300);

const debouncedCheckEducatorUniqueFields = debounce(async (email) => {
    try {
        const response = await api.post('/check-educator-unique-fields/', 
        {email
        ,headers: {
            'X-CSRFToken': csrfToken,
        }}
    );   

        if (!response.data.success) {    
            setErrorFields({
            email: response.data.message,
            });  

        }
        else {
            setErrorFields({});
        }

        if(response.data.success){

            try {
                const response = await api.post('/educator-send-otp/', { email },{headers: {
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
        }


    } catch (error) {
        console.error('Error checking unique fields:', error);
        setErrorFields({
            email: 'Error checking email. Please try again.',
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

    const handleInputChange = (e) => {
        const { name, value, type, files } = e.target;
        if (type === 'file') {
            setFormData((prevFormData) => ({
                ...prevFormData,
                [name]: files[0], 
            }));
        } else {
            setFormData((prevFormData) => ({
                ...prevFormData,
                [name]: value,
            }));
        }

        if (name === 'username') {
            debouncedCheckEducatorUsernameAvailability(value);
        }

        if (name === 'password') {
            const errors = validatePassword(value);
            setPasswordErrors(errors);
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
    

        if (passwordErrors.length > 0) {
            alert('Please fix password errors before submitting.');
            return;
        }
    

        const { email} = formData;
    

        await debouncedCheckEducatorUniqueFields(email);

    
        setIsLoading(true);
        
    };
    
    
    const handleOTPVerification = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await api.post('/educator-verify-otp/', {
                email: formData.email,
                otp: otp,
            },{headers: {
                'X-CSRFToken': csrfToken,
            }});

            if (response.data.success) {
                setIsOtpVerified(true);
                alert('OTP verified successfully!');
                await handleEducatorSignup();
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
            const response = await api.post('/educator-send-otp/', {
                email: formData.email, headers: {
                    'X-CSRFToken': csrfToken,
                }
            });
            alert(response.data.message);
            setOtpSent(true);
            setOtp(''); 
        } catch (error) {
            console.error('Error sending OTP:', error);
            alert('Failed to send OTP. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleEducatorSignup = async () => {
        try {
            const dataToSend = {
                ...formData,
                otp: otp,
            };

            const response = await api.post('/educator-signup/', dataToSend, {headers: {
                'Content-Type': 'multipart/form-data',
                'X-CSRFToken': csrfToken,
        }});

            if (response.status === 201) {
                alert('Educator signed up successfully!');
            } else {
                alert(`Error: ${response.data.message}`);
            }
        } catch (error) {
            console.error('Error during signup:', error);
            alert('Error during signup. Please try again.');
        }
    };


    return (
        <div className="educator-component-background">
            <div className="container2">
            <h2>Educator Sign Up</h2>
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
                        <form onSubmit={handleSubmit} encType="multipart/form-data">
                        
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

                            <label>Profile Picture</label>
                            <input
                                type="file"
                                name="profile_picture"
                                accept="image/*"
                                onChange={handleInputChange}
                                required
                            /><br></br>

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
                                required
                            />
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
    <p style={{ color: 'green' }}>Username is available</p>
)}
{usernameAvailable === false && !errorFields.username && (
    <p style={{ color: 'red' }}></p>
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

                            <label>Bio</label>
                            <textarea
                               name="bio"
                               value={formData.bio}
                               onChange={handleInputChange}
                               required
                            />

                            <input type="submit" value="Sign Up" />
                        </form>
                    )}
                    <a href="/educator-signin">Already have an Account? Sign In</a>
                </>
            ) : (
                <div>
                    <p>OTP verified and Educator Signed Upsuccessfully! Proceed with the next steps.</p>
                    <a href="/educator-signin">Sign In Now</a>

                </div>
            )}
            </div>
        </div>
    );
}
export default EducatorSignUp;