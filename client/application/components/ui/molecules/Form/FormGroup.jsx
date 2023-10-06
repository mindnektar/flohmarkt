import React from 'react';
import PropTypes from 'prop-types';

const FormGroup = (props) => (
    <div className="ui-form-group">
        {props.children}
    </div>
);

FormGroup.propTypes = {
    children: PropTypes.node.isRequired,
};

export default FormGroup;
