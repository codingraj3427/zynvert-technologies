import React from "react";
import ContactSection from "../Home/ContactSection";
import FacebookIcon from "../../assets/icons/FacebookIcon";
import XIcon from "../../assets/icons/XIcon";
import InstagramIcon from "../../assets/icons/InstagramIcon";
import YouTubeIcon from "../../assets/icons/YoutubeIcon";
import TelegramIcon from "../../assets/icons/TelegramIcon";

// Static contact information extracted from Footer.jsx for use on this page
const contactInfo = {
  phone: "+91 9123708861",
  email: "support@zynvert.com",
  address:
    "Debolina apartment Flat no-101 Ground floor, Kolkata - 700059, West Bengal, India",
};
const mapAddressQuery =
  "Debolina+apartment+Flat+no-101+Ground+floor,+Kolkata+-+700059,+West+Bengal,+India";

const ContactPage = () => (
  <div className="contact-page page-section section-reveal visible">
    <h1 className="section-title">Reach Out to Zynvert</h1>
    <p className="section-subtitle">
      We are here to assist you with sales, support, and technical questions.
    </p>

    <div className="contact-info-grid">
      <div className="contact-card">
        <h3>Call Us</h3>
        <p>10 AM - 6 PM (Mon-Sat)</p>
        <a href={`tel:${contactInfo.phone}`} className="phone-number">
          {contactInfo.phone}
        </a>
      </div>
      <div className="contact-card">
        <h3>Email & Address</h3>
        <p>{contactInfo.address}</p>
        <a href={`mailto:${contactInfo.email}`}>{contactInfo.email}</a>
      </div>
      <div className="contact-card">
        <h3>Connect Socially</h3>
        <div className="social-icons">
          <a href="https://facebook.com" aria-label="Facebook">
            <FacebookIcon />
          </a>
          <a href="https://x.com" aria-label="X">
            <XIcon />
          </a>
          <a href="https://instagram.com" aria-label="Instagram">
            <InstagramIcon />
          </a>
          <a href="https://youtube.com" aria-label="YouTube">
            <YouTubeIcon />
          </a>
          <a href="https://telegram.org" aria-label="Telegram">
            <TelegramIcon />
          </a>
        </div>
      </div>
    </div>

    <ContactSection />
    {/* NEW: Google Map Embed Section */}
    <div className="google-map-section section-reveal">
      <h2 className="section-title">Our Location</h2>
      <div className="google-map-container">
        <iframe
          src={`https://maps.google.com/maps?q=${mapAddressQuery}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Zynvert Technologies Location"
        ></iframe>
      </div>
    </div>
  </div>
);

export default ContactPage;
