import React, { useState } from "react";
import { authService } from "../../services/auth.service";
import GoogleIcon from "../../assets/icons/GoogleIcon";
import AppleIcon from "../../assets/icons/AppleIcon";

const RegisterPage = ({ onToggleView }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    // 1. Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Error: Passwords do not match.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Error: Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);

    try {
      // 2. Call Service with all new fields
      await authService.register(
        formData.firstName,
        formData.lastName,
        formData.phone,
        formData.email,
        formData.password
      );

      // 3. Success Feedback
      setMessage("Registration successful! Redirecting...");
      
      // The App.js auth listener will detect the login and redirect, 
      // but we can also trigger a view toggle if needed.
      setTimeout(() => {
        // Optional: onToggleView(); 
      }, 1500);

    } catch (err) {
      console.error("Registration failed:", err);
      // specific Firebase error handling could go here
      setError("Registration failed: " + (err.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      await authService.loginWithGoogle();
    } catch (err) {
      setError("Google Sign-Up failed: " + err.message);
    }
  };

  return (
    <div className="auth-card section-reveal visible">
      <div className="auth-card-header">
        <h2>Create Account</h2>
        <p>Sign up to get started</p>
        
        {error && (
          <p style={{ color: "var(--primary-color)", marginBottom: "15px", fontWeight: "bold" }}>
            {error}
          </p>
        )}
        {message && (
          <p style={{ color: "var(--accent-color)", marginBottom: "15px", fontWeight: "bold" }}>
            {message}
          </p>
        )}
      </div>

      <form className="auth-form" onSubmit={handleSignup}>
        {/* Name Fields Row */}
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div className="form-group" style={{ flex: 1 }}>
            <label htmlFor="firstName">First Name</label>
            <input
              type="text"
              id="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label htmlFor="lastName">Last Name</label>
            <input
              type="text"
              id="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="phone">Phone Number</label>
          <input
            type="tel"
            id="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+1 234 567 8900"
            required
            disabled={loading}
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
            disabled={loading}
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
            disabled={loading}
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
            disabled={loading}
          />
        </div>

        <button type="submit" className="auth-btn" disabled={loading}>
          {loading ? "Creating Account..." : "Sign Up"}
        </button>
      </form>

      <div className="auth-divider">
        <span>OR</span>
      </div>

      <button className="google-btn" onClick={handleGoogleSignup} type="button" disabled={loading}>
        <GoogleIcon />
        Sign Up with Google
      </button>
      <button className="google-btn" style={{ marginTop: "10px" }} type="button" disabled={loading}>
        <AppleIcon />
        Sign Up with Apple
      </button>

      <div className="auth-toggle">
        Already have an account?
        <button onClick={onToggleView} disabled={loading}>Sign In</button>
      </div>
    </div>
  );
};

export default RegisterPage;