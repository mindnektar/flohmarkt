import React from 'react';
import PropTypes from 'prop-types';
import Icon from 'atoms/Icon';

const Close = (props) => (
    <div
        className="ui-close"
        onClick={props.onClick}
    >
        <Icon type="close" />
    </div>
);

Close.propTypes = {
    onClick: PropTypes.func.isRequired,
};

export default Close;
