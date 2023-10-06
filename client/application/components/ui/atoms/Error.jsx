import React from 'react';
import PropTypes from 'prop-types';
import Collapsible from 'molecules/Collapsible';

const Error = (props) => (
    <Collapsible collapsed={!props.children}>
        <div className="ui-error">
            {props.children}
        </div>
    </Collapsible>
);

Error.defaultProps = {
    children: null,
};

Error.propTypes = {
    children: PropTypes.node,
};

export default Error;
