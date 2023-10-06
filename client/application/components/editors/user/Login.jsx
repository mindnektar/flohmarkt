import React from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router';
import { useApolloClient } from '@apollo/client';
import useAuth, { AUTH_TYPE_ADMIN, AUTH_TYPE_VENDOR } from 'hooks/useAuth';
import useCreateAuthToken from 'hooks/graphql/mutations/createAuthToken';
import Modal, { Screen } from 'molecules/Modal';
import LoginData from './screens/LoginData';

const Login = (props) => {
    const createAuthToken = useCreateAuthToken();
    const history = useHistory();
    const client = useApolloClient();
    const { setToken } = useAuth();

    const confirm = async (values) => {
        const { data } = await createAuthToken({
            email: values.email.trim(),
            password: values.password,
        });

        const authTypeMap = {
            admin: AUTH_TYPE_ADMIN,
            vendor: AUTH_TYPE_VENDOR,
        };
        const { authToken, role } = data.createAuthToken;

        setToken(authTypeMap[role], authToken);
        client.restartWebSocketConnection();

        await client.resetStore();

        history.replace('/');

        props.close();
    };

    return (
        <Modal
            close={props.close}
            confirmButtonLabel="Anmelden"
            formConfig={{
                email: '',
                password: '',
            }}
            isOpen={props.isOpen}
            onConfirm={confirm}
        >
            <Screen headline="Login">
                <LoginData />
            </Screen>
        </Modal>
    );
};

Login.propTypes = {
    close: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired,
};

export default Login;
