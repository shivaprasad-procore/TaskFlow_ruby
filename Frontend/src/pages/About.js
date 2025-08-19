import React from 'react';
import './About.css';

const FeatureCard = ({ icon, title, description }) => (
  <div className="feature-card">
    <div className="icon">{icon}</div>
    <h3>{title}</h3>
    <p>{description}</p>
  </div>
);

const About = () => {
  return (
    <div className="about-wrapper">
      <div className="about-box">
        <h1 className="about-heading">About TaskFlow</h1>
        <p className="about-subtext">
          A straightforward tool to help you manage your tasks cleanly and clearly.
        </p>

        <div className="feature-grid">
          <FeatureCard 
            icon="✅" 
            title="Quick Actions" 
            description="Create and update tasks instantly." 
          />
          <FeatureCard 
            icon="📊" 
            title="Status Tracking" 
            description="Track your work with clear labels." 
          />
          <FeatureCard 
            icon="📅" 
            title="Due Dates" 
            description="Set deadlines and never miss a task." 
          />
          <FeatureCard 
            icon="🗂️" 
            title="Categories" 
            description="Group tasks to stay organized." 
          />
        </div>
      </div>
    </div>
  );
};

export default About;
