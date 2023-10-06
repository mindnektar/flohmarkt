import React, { useContext, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { findDeep } from 'helpers/objects';
import ModalContext from 'contexts/modal';
import FormItemContext from 'contexts/formItem';
import Error from 'atoms/Error';
import Collapsible from 'molecules/Collapsible';

export const FORM_ITEM_LABEL_HEIGHT_AUTO = 'auto';
export const FORM_ITEM_LABEL_HEIGHT_SMALL = 24;

const FormItem = (props) => {
    const modal = useContext(ModalContext);
    const formValue = findDeep(modal.formValues, props.name);
    const formItemContextValue = useMemo(() => ({
        onChange: (value) => {
            modal.setFormValue(props.name, value);
        },
        onError: modal.setErrorMessageHandler(props.name),
        value: props.formatValue(formValue !== undefined ? formValue : ''),
        unformattedValue: formValue,
    }), [formValue]);

    useEffect(() => {
        modal.registerValidators(props.name, props.validators);
    });

    useEffect(() => (
        () => {
            modal.deregisterFrontendValidators(props.name);
        }
    ), []);

    const getErrorMessage = () => {
        const error = modal.errors[props.name];

        if (!error) {
            return null;
        }

        const hasMatchingValidator = props.validators?.some((validator) => (
            validator.message === error.message || validator.serverError === error.serverError
        ));

        if (error.alwaysShow || hasMatchingValidator) {
            return typeof error.message === 'function' ? error.message(error.data) : error.message;
        }

        return null;
    };

    const errorMessage = getErrorMessage();

    return (
        <div
            className={classNames(
                'ui-form-item',
                {
                    'ui-form-item--full-width': props.fullWidth,
                    'ui-form-item--has-error': !!errorMessage,
                },
            )}
        >
            <div className="ui-form-item__wrapper">
                <div
                    className="ui-form-item__label"
                    style={{ height: props.labelHeight }}
                >
                    <div>{props.label}</div>
                </div>

                <div className="ui-form-item__content-wrapper">
                    <div className="ui-form-item__content">
                        <FormItemContext.Provider value={formItemContextValue}>
                            {props.children}
                        </FormItemContext.Provider>
                    </div>
                </div>
            </div>

            <div className="ui-form-item__error">
                <Error>{errorMessage}</Error>

                <Collapsible collapsed={!props.info}>
                    <div className="ui-form-item__info">
                        {props.info}
                    </div>
                </Collapsible>
            </div>
        </div>
    );
};

FormItem.defaultProps = {
    formatValue: (value) => value,
    fullWidth: false,
    info: null,
    label: '',
    labelHeight: FORM_ITEM_LABEL_HEIGHT_AUTO,
    name: null,
    validators: null,
};

FormItem.propTypes = {
    children: PropTypes.node.isRequired,
    formatValue: PropTypes.func,
    fullWidth: PropTypes.bool,
    info: PropTypes.node,
    label: PropTypes.node,
    labelHeight: PropTypes.oneOf([
        FORM_ITEM_LABEL_HEIGHT_AUTO,
        FORM_ITEM_LABEL_HEIGHT_SMALL,
    ]),
    name: PropTypes.string,
    validators: PropTypes.arrayOf(
        PropTypes.shape({
            isValid: PropTypes.func,
            message: PropTypes.oneOfType([PropTypes.string, PropTypes.func]).isRequired,
            serverError: PropTypes.string,
            skip: PropTypes.func,
        }),
    ),
};

export default FormItem;
