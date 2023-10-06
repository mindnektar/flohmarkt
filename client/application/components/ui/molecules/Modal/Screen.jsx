import React, { useContext } from 'react';
import ModalContext from 'contexts/modal';
import PropTypes from 'prop-types';

const Screen = (props) => {
    const modal = useContext(ModalContext);

    return (
        <div className="ui-modal-screen">
            {typeof props.children === 'function' ? props.children(modal) : props.children}
        </div>
    );
};

Screen.defaultProps = {
    children: null,
};

Screen.propTypes = {
    children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
    headline: PropTypes.string.isRequired,
};

export default Screen;
