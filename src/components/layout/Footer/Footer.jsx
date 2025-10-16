import React from "react";
import FooterLogoIcon from "../../../assets/icons/FooterLogoIcon";
import FacebookIcon from "../../../assets/icons/FacebookIcon";
import XIcon from "../../../assets/icons/XIcon";
import InstagramIcon from "../../../assets/icons/InstagramIcon";
import YouTubeIcon from "../../../assets/icons/YouTubeIcon";
import TelegramIcon from "../../../assets/icons/TelegramIcon";
const toUrlFriendly = (text) =>
  text
    .toLowerCase()
    .replace(/ & /g, "-")
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "");
const footerCategories = [
  "Audio Boards",
  "Transformers",
  "AC TO DC Power Supply",
  "SMPS Boards",
  "Speakers",
  "AVR Boards",
  "Connector",
];
const footerPolicies = [
  "Privacy Policy",
  "Refund & Cancellations",
  "Terms & Conditions",
  "About Us",
];
const Footer = () => (
  <footer className="footer section-reveal">
    <div className="footer-content">
      <div className="footer-column about">
        <div className="logo-container"><FooterLogoIcon /></div>
        <p>Call us 10 AM - 6 PM</p>
        <p className="phone-number">+91 9123708861</p>
        <div className="social-icons">
          <a href="https://facebook.com" aria-label="Facebook"><FacebookIcon /></a>
          <a href="https://x.com" aria-label="X"><XIcon /></a>
          <a href="https://instagram.com" aria-label="Instagram"><InstagramIcon /></a>
          <a href="https://youtube.com" aria-label="YouTube"><YouTubeIcon /></a>
          <a href="https://telegram.org" aria-label="Telegram"><TelegramIcon /></a>
        </div>
      </div>
      <div className="footer-column links">
        <h4>Categories</h4>
        <ul>{footerCategories.map((cat) => (<li key={cat}><a href={`/category/${toUrlFriendly(cat)}`}>{cat}</a></li>))}</ul>
      </div>
      <div className="footer-column links">
        <h4>Our Policies</h4>
        <ul>{footerPolicies.map((policy) => (<li key={policy}><a href={`/policy/${toUrlFriendly(policy)}`}>{policy}</a></li>))}</ul>
      </div>
      <div className="footer-column contact">
        <h4>Contact Us</h4>
        <p>Debolina apartment Flat no-101 Ground floor, Kolkata - 700059, West Bengal, India</p>
        <a href="mailto:support@zynvert.com">support@zynvert.com</a>
      </div>
    </div>
    <div className="footer-bottom">
      <p>Copyright © {new Date().getFullYear()} Zynvert Technologies.</p>
      <div className="payment-info">
        <span>We Use Safe Payment For</span>
        <img src="https://placehold.co/150x25/ffffff/333?text=Payment+Methods" alt="Payment Methods" />
      </div>
    </div>
  </footer>
);

export default Footer;