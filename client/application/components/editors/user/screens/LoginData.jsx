import React from 'react';
import PropTypes from 'prop-types';
import TextField from 'atoms/TextField';
import Button from 'atoms/Button';
import Form, { FormItem, FormText, FormGroup } from 'molecules/Form';

const LoginData = (props) => (
    <Form>
        <FormGroup>
            <FormItem
                label="E-Mail-Adresse"
                name="email"
            >
                <TextField type="email" />
            </FormItem>

            <FormItem
                label="Passwort"
                name="password"
                validators={[{
                    message: 'Die Zugangsdaten sind inkorrekt.',
                    serverError: 'INVALID_CREDENTIALS',
                }]}
            >
                <TextField type="password" />
            </FormItem>
        </FormGroup>

        <FormGroup>
            <FormText>
                <Button
                    borderless
                    light
                    onClick={props.openPasswordResetDialog}
                >
                    Passwort vergessen?
                </Button>
            </FormText>
        </FormGroup>
    </Form>
);

LoginData.propTypes = {
    openPasswordResetDialog: PropTypes.func.isRequired,
};

export default LoginData;
