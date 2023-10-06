import React from 'react';
import { useHistory } from 'react-router-dom';
import { useApolloClient } from '@apollo/client';
import useAuth, { AUTH_TYPE_NONE } from 'hooks/useAuth';
import useToggle from 'hooks/useToggle';
import Button from 'atoms/Button';
import LoginModal from 'editors/user/Login';

const Account = () => {
    const client = useApolloClient();
    const history = useHistory();
    const { authType, deleteToken } = useAuth();
    const isLoggedIn = authType !== AUTH_TYPE_NONE;
    const [isLoginOpen, openLogin, closeLogin] = useToggle(false);

    const logout = async () => {
        deleteToken(authType);
        await client.resetStore();
        history.replace('/');
    };

    return (
        <div className="account">
            {isLoggedIn ? (
                <Button
                    light
                    onClick={logout}
                >
                    Abmelden
                </Button>
            ) : (
                <Button
                    light
                    onClick={openLogin}
                >
                    Anmelden
                </Button>
            )}

            <LoginModal
                close={closeLogin}
                isOpen={isLoginOpen}
            />
        </div>
    );
};

export default Account;
