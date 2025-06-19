import React from 'react';
import LoginForm from '../components/auth/LoginForm';

const Login = () => {
  return (
    <div className="login-container">
      <div className="login-card">
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;