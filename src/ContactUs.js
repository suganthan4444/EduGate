//react-project/src/ContactUs.js
import React from 'react'; 
import './ContactUs.css';

function ContactUs() {
  return (
    <div >
      <header><h1  className="contact-us">Wanna Connect with Us</h1></header>
      <div className="image"> 
      <img src="color.png" alt="Colorful abstract artwork" className='logo'></img><br></br>
       <div class="contact-info">
        <h2 class="cont">Contact Information</h2>
        <ul>
            <li className="email">Email: <a href="mailto:edugate.ed@gmail.com">edugate.ed@gmail.com</a></li>
            <br></br>
            <li className="mobile">Phone: <a href="tel:+919360708484">+91 9360708484</a></li>
            <br></br>
            <li className="address">Address: 123 Street, Trichy, India</li>
            <br></br>
        </ul>

    </div>
         
      </div>
      </div>
        
  );
}

export default ContactUs;
