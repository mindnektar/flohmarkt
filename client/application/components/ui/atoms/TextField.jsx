import React, { useImperativeHandle, useContext, useRef, forwardRef } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import ModalContext from 'contexts/modal';
import FormItemContext from 'contexts/formItem';
import Icon from 'atoms/Icon';

const TextField = forwardRef((props, ref) => {
    const inputRef = useRef();
    const modalContext = useContext(ModalContext);
    const formItemContext = useContext(FormItemContext);
    const value = props.value !== null ? props.value : formItemContext?.value;
    const unformattedValue = props.value !== null ? props.value : formItemContext?.unformattedValue;

    const onChange = (event) => {
        if (props.onChange) {
            props.onChange(event.target.value);
        } else if (formItemContext) {
            formItemContext.onChange(event.target.value);
        }
    };

    const onKeyPress = async (event) => {
        if (event.which === 13 && props.submitOnEnter) {
            let promise = Promise.resolve();

            if (props.onSubmit) {
                promise = props.onSubmit(event) || Promise.resolve();
            }

            if (modalContext) {
                await promise;
                modalContext.confirm();
            }
        }
    };

    const clear = () => {
        props.onClear();

        if (props.onChange) {
            props.onChange('');
        } else if (formItemContext) {
            formItemContext.onChange('');
        }
    };

    const focus = () => {
        inputRef.current?.focus();
    };

    const clearAndFocus = (event) => {
        event.stopPropagation();
        clear();
        focus();
    };

    useImperativeHandle(ref, () => ({ clear, focus }));

    return (
        <div
            className={classNames(
                'ui-text-field',
                { 'ui-text-field--has-value': !!unformattedValue },
            )}
            onClick={props.onClick}
        >
            <input
                ref={inputRef}
                className="ui-text-field__input"
                maxLength={props.maxLength}
                onBlur={props.onBlur}
                onChange={onChange}
                onFocus={props.onFocus}
                onKeyPress={onKeyPress}
                type={props.type}
                value={value}
            />

            {props.clearable && (
                <div
                    className="ui-text-field__clear"
                    onClick={clearAndFocus}
                >
                    <Icon type="close-fill" />
                </div>
            )}
        </div>
    );
});

TextField.defaultProps = {
    clearable: false,
    maxLength: 255,
    onBlur: null,
    onChange: null,
    onClear: () => null,
    onClick: null,
    onFocus: null,
    onSubmit: null,
    submitOnEnter: true,
    type: 'text',
    value: null,
};

TextField.propTypes = {
    clearable: PropTypes.bool,
    maxLength: PropTypes.number,
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
    onClear: PropTypes.func,
    onClick: PropTypes.func,
    onFocus: PropTypes.func,
    onSubmit: PropTypes.func,
    submitOnEnter: PropTypes.bool,
    type: PropTypes.string,
    value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
        PropTypes.node,
    ]),
};

export default TextField;
