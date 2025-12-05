import React, { useState } from "react";
// Ensure this path matches your folder structure
import { authService } from "../../services/auth.service"; 
import GoogleIcon from "../../assets/icons/GoogleIcon";
import AppleIcon from "../../assets/icons/AppleIcon";

const LoginPage = ({ onToggleView }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    if (id === 'email') setEmail(value);
    if (id === 'password') setPassword(value);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await authService.login(email, password);
      console.log("Login Successful");
      // App.js handles redirect logic based on auth state
    } catch (err) {
      console.error("Login Error:", err);
      let errorMessage = "Invalid email or password.";
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        errorMessage = "Invalid email or password.";
      } else if (err.code === 'auth/too-many-requests') {
        errorMessage = "Too many failed attempts. Please try again later.";
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      await authService.loginWithGoogle();
      // App.js handles redirect logic based on auth state
    } catch (err) {
      console.error("Google Login Error:", err);
      setError("Google Sign-In failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-card section-reveal visible">
      <div className="auth-card-header">
        <h2>Welcome Back!</h2>
        <p>Sign in to continue</p>
        {error && <p style={{ color: 'var(--primary-color)', marginBottom: '15px', fontWeight: 'bold' }}>{error}</p>}
      </div>
      
      <form className="auth-form" onSubmit={handleLogin}>
        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input 
            type="email" 
            id="email" 
            value={email}
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
            value={password}
            onChange={handleChange}
            required 
            disabled={loading}
          />
        </div>
        
        <a href="#forgot" className="forgot-password">
          Forgot Password?
        </a>
        
        <button type="submit" className="auth-btn" disabled={loading}>
          {loading ? "Signing In..." : "Sign In"}
        </button>
      </form>

      <div className="auth-divider">
        <span>OR</span>
      </div>

      <button className="google-btn" onClick={handleGoogleLogin} type="button" disabled={loading}>
        <GoogleIcon />
        Sign In with Google
      </button>
      <button className="google-btn" style={{ marginTop: "10px" }} type="button" disabled={loading}>
        <AppleIcon />
        Sign In with Apple
      </button>

      <div className="auth-toggle">
        Don't have an account?
        <button onClick={onToggleView} disabled={loading}>Sign Up</button>
      </div>
    </div>
  );
};

export default LoginPage;