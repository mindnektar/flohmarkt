import React from 'react';
import PropTypes from 'prop-types';

const FormText = (props) => (
    <div className="ui-form-text">
        {props.children}
    </div>
);

FormText.propTypes = {
    children: PropTypes.node.isRequired,
};

export default FormText;
