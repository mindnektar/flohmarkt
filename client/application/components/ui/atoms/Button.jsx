import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const Button = (props) => {
    const onClick = () => {
        if (props.href) {
            window.open(props.href, '_blank');
        }

        props.onClick();
    };

    return (
        <button
            className={classNames(
                'ui-button',
                {
                    'ui-button--disabled': props.disabled,
                    'ui-button--light': props.light,
                },
            )}
            onClick={onClick}
            type="button"
        >
            {props.children}
        </button>
    );
};

Button.defaultProps = {
    disabled: false,
    href: null,
    light: false,
    onClick: () => null,
};

Button.propTypes = {
    children: PropTypes.node.isRequired,
    disabled: PropTypes.bool,
    href: PropTypes.string,
    light: PropTypes.bool,
    onClick: PropTypes.func,
};

export default Button;
