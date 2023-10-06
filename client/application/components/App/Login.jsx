import React from 'react';
import LoginModal from 'editors/user/Login';

const Login = () => (
    <div className="login">
        <img
            alt="Logo"
            className="login__logo"
            src="/img/logo.png"
        />

        <LoginModal />
    </div>
);

export default Login;
