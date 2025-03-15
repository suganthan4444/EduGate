//react-project/src/AboutUs.js
import React from 'react';
import './AboutUs.css';

function AboutUs() {
  return (
    <div className="about-us">
    <header><h1>Explore Us!</h1></header>
    <section class="about-us">
  <h2>Our Mission: Learning That Fits Your Life</h2>
  <p>We understand that traditional learning doesn't always fit today's busy schedules. That's why we create:</p>
  <ul>
    <li>Bite-sized, digestible content: Learn on-the-go with short videos, interactive modules, and downloadable resources that fit your busy life.</li>
    <li>Flexible learning paths: Choose from pre-designed courses or create your own personalized learning journey based on your goals and interests.</li>
    <li>State-of-the-art technology: We leverage the power of digital tools, gamification, and adaptive learning to make learning interactive and efficient.</li>
  </ul>

  <h3>More Than Just Information</h3>
  <p>We go beyond simply providing information. Here's what sets us apart:</p>
  <ul>
    <li>The Human Touch: Our expert instructors create engaging content and facilitate online communities, fostering a supportive learning environment.</li>
    <li>Focus on Practical Skills: We equip you with in-demand skills applicable to the real world, preparing you for success in your chosen field.</li>
    <li>Data-Driven Learning: We track your progress and personalize learning recommendations to maximize your results.</li>
  </ul>

  <div class="cta">
    <p>Join the Digital Learning Revolution!</p>
  </div>
</section>

    </div>
  );
}

export default AboutUs;