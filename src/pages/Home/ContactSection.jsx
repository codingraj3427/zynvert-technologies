import React from "react";

const ContactSection = () => (
  <section className="page-section bg-light section-reveal">
    <h2 className="section-title">Get In Touch</h2>
    <p className="section-subtitle">Have questions? We'd love to hear from you.</p>
    <form className="contact-form">
      <div className="form-row">
        <input type="text" placeholder="Your Name" required />
        <input type="email" placeholder="Your Email" required />
      </div>
      <textarea placeholder="Your Message" rows="6" required></textarea>
      <button type="submit" className="submit-btn">Send Message</button>
    </form>
  </section>
);

export default ContactSection;