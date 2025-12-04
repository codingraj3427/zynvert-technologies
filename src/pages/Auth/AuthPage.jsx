import React, { useState } from "react";
import LoginPage from "./LoginPage";
import RegisterPage from "./RegisterPage";

const AuthPage = () => {
  const [isLoginView, setIsLoginView] = useState(true);

  const toggleView = () => setIsLoginView(!isLoginView);

  return (
    <div className="auth-page">
      {isLoginView ? (
        <LoginPage onToggleView={toggleView} />
      ) : (
        <RegisterPage onToggleView={toggleView} />
      )}
    </div>
  );
};

export default AuthPage;
