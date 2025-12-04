import React from "react";
import GoogleIcon from "../../assets/icons/GoogleIcon";
import AppleIcon from "../../assets/icons/AppleIcon";

const LoginPage = ({ onToggleView }) => {
  return (
    <div className="auth-card section-reveal visible">
      <div className="auth-card-header">
        <h2>Welcome Back!</h2>
        <p>Sign in to continue</p>
      </div>
      <form className="auth-form">
        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input type="email" id="email" required />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" required />
        </div>
        <a href="#forgot" className="forgot-password">
          Forgot Password?
        </a>
        <button type="submit" className="auth-btn">
          Sign In
        </button>
      </form>
      <div className="auth-divider">
        <span>OR</span>
      </div>
      <button className="google-btn">
        <GoogleIcon />
        Sign In with Google
      </button>
      <button className="google-btn" style={{ marginTop: "10px" }}>
        <AppleIcon />
        Sign In with Apple
      </button>
      <div className="auth-toggle">
        Don't have an account?
        <button onClick={onToggleView}>Sign Up</button>
      </div>
    </div>
  );
};

export default LoginPage;
