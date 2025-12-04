import React, { useState } from "react";
import GoogleIcon from "../../assets/icons/GoogleIcon";
import AppleIcon from "../../assets/icons/AppleIcon";

const RegisterPage = ({ onToggleView }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  /**
   * Proper client-side sign-up function (MOCK)
   */
  const handleSignup = (e) => {
    e.preventDefault(); // Prevent default browser form submission
    setMessage(null);
    setError(null);

    // Basic Client-Side Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Error: Passwords do not match.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Error: Password must be at least 6 characters long.");
      return;
    }

    // --- Start Mock API Call ---
    console.log("Attempting to register:", formData.email);

    // Simulate successful registration after a delay
    setTimeout(() => {
      // In a real application, you would make a fetch/axios POST request here.
      // e.g., fetch('/api/signup', { method: 'POST', body: JSON.stringify(formData) })

      // Mock success message and redirect
      setMessage("Registration successful! Redirecting to login...");
      setTimeout(onToggleView, 1500); // Redirect to login after 1.5s
    }, 1000);
    // --- End Mock API Call ---
  };

  return (
    <div className="auth-card section-reveal visible">
      <div className="auth-card-header">
        <h2>Create Account</h2>
        <p>Sign up to get started</p>
        {/* Display Status Messages */}
        {error && (
          <p style={{ color: "var(--primary-color)", marginBottom: "15px" }}>
            {error}
          </p>
        )}
        {message && (
          <p style={{ color: "var(--accent-color)", marginBottom: "15px" }}>
            {message}
          </p>
        )}
      </div>
      {/* The form now uses the proper onSubmit handler 
        and inputs are connected to the component state via value and onChange.
      */}
      <form className="auth-form" onSubmit={handleSignup}>
        <div className="form-group">
          <label htmlFor="name">Full Name</label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="auth-btn">
          Sign Up
        </button>
      </form>
      <div className="auth-divider">
        <span>OR</span>
      </div>
      <button className="google-btn">
        <GoogleIcon />
        Sign Up with Google
      </button>
      <button className="google-btn" style={{ marginTop: "10px" }}>
        <AppleIcon />
        Sign Up with Apple
      </button>
      <div className="auth-toggle">
        Already have an account?
        <button onClick={onToggleView}>Sign In</button>
      </div>
    </div>
  );
};

export default RegisterPage;
