//react-project/src/ContactUs.js
import React from 'react'; 
import './ContactUs.css';

function ContactUs() {
  return (
    <div >
      <header><h1  className="contact-us">Wanna Reach Us</h1></header>
      <div className="image"> 
      <img src="color.png" alt="Colorful abstract artwork"></img><br></br>
       <div class="contact-info">
        <h2 class="cont">Contact Information</h2>
        <ul>
            <li className="mail">Email:edugate123@gmail.com</li>
            <li className="mail">Phone: +91 9360708484</li>
            <li className="mail">Address: 123 Street, Trichy, India</li>
        </ul>
    </div>
         
      </div>
      </div>
        
  );
}

export default ContactUs;
